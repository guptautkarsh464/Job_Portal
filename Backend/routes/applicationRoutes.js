const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getApplicationForJob,
  getApplicationById,
  updateStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicationForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateStatus);

module.exports = router;
