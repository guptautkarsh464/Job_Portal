const express = require("express");
const router = express.Router();

const { createJob, getJobs } = require("../controllers/jobController");

const { protect } = require("../middlewares/authMiddleware");

// Protected Routes

router.post("/createJob", protect, createJob);

module.exports = router;
