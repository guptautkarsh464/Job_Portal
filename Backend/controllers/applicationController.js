const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc Apply to a Job
exports.applyToJob = async (req, res) => {
  console.log("Apply controller hit");

  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply " });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume, // assuming resume is stored in user profile
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's application
exports.getMyApplications = async (req, res) => {
  try {
    const apps = (
      await Application.find({ applicant: req.user._id }).populate(
        "job",
        "title company location type",
      )
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@ desc Get all applicants for a job (Employer)

exports.getApplicationForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get application by ID (Jobseeker or Employer)

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title")
      .populate("applicant", "name email avatar resume");

    if (!app)
      return res
        .status(404)
        .json({ message: "Application not found.", id: req.params.id });

    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorised to view the application" });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Application status (Employer)

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate(
      "job",
      "company",
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (app.job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorised to update status" });
    }

    app.status = status;
    await app.save();

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
