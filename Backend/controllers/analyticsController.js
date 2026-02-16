const Job = require("../models/Job");
const Application = require("../models/Application");

const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

exports.getEmployerAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const companyId = req.user._id;

    // ===== Date Setup =====
    const now = new Date();

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const prev7Days = new Date();
    prev7Days.setDate(now.getDate() - 14);

    // ===== Get All Employer Jobs =====
    const jobs = await Job.find({ company: companyId }).select("_id").lean();

    const jobIds = jobs.map((job) => job._id);

    // ===== Total Counts =====
    const totalActiveJobs = await Job.countDocuments({
      company: companyId,
      isClosed: false,
    });

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const totalHired = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
    });

    // ===== Active Jobs Trend =====
    const activeJobsLast7 = await Job.countDocuments({
      company: companyId,
      createdAt: { $gte: last7Days, $lt: now },
    });

    const activeJobsPrev7 = await Job.countDocuments({
      company: companyId,
      createdAt: { $gte: prev7Days, $lt: last7Days },
    });

    const activeJobTrend = getTrend(activeJobsLast7, activeJobsPrev7);

    // ===== Applications Trend =====
    const applicationsLast7 = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: last7Days, $lt: now },
    });

    const applicationsPrev7 = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: prev7Days, $lt: last7Days },
    });

    const applicationTrend = getTrend(applicationsLast7, applicationsPrev7);

    // ===== Hired Trend =====
    const hiredLast7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: last7Days, $lt: now },
    });

    const hiredPrev7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: prev7Days, $lt: last7Days },
    });

    const hiredTrend = getTrend(hiredLast7, hiredPrev7);

    // ===== Recent Jobs =====
    const recentJobs = await Job.find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location type createdAt isClosed");

    // ===== Recent Applications =====
    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "name email avatar")
      .populate("job", "title");

    // ===== Response =====
    res.json({
      counts: {
        totalActiveJobs,
        totalApplications,
        totalHired,
        trends: {
          activeJobs: activeJobTrend,
          totalApplicants: applicationTrend,
          totalHired: hiredTrend,
        },
      },
      data: {
        recentJobs,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      message: "failed to fetch analytics",
      error: error.message,
    });
  }
};
