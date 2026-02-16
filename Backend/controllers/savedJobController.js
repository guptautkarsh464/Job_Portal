const SavedJob = require("../models/SavedJob");

//@desc Save a Job
exports.saveJob = async (req, res) => {
  console.log("savejob contoleler");
  try {
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    if (exists) return res.status(400).json({ message: "Job already save" });

    const saved = await SavedJob.create({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    res.status(201).json(saved);
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to save job", error: error.message });
  }
};

//@desc Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Job not found in saved list." });
    }

    res.json({ message: "Job removed from saved list successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to remove job", error: error.message });
  }
};

//@desc Get Saved Job for current User
exports.getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      jobSeeker: req.user._id,
    }).populate({
      path: "job",
      populate: {
        path: "company",
        select: "name companyName companyLogo",
      },
    });
    res.json(savedJobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to fetch saved job", error: error.message });
  }
};
