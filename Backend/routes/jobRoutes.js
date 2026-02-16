const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobsEmployer,
  toggleCloseJob,
  deleteJob,
  updateJob,
  getJobById,
} = require("../controllers/jobController");

const { protect } = require("../middlewares/authMiddleware");

// Protected Routes

router.route("/").post(protect, createJob).get(getJobs);
router.route("/get-jobs-employer").get(protect, getJobsEmployer);
router
  .route("/:id")
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);
router.put("/:id/toggle-close", protect, toggleCloseJob);

module.exports = router;
