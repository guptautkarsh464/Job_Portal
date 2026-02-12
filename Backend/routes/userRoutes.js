const express = require("express");
const router = express.Router();

const {
  updateProfile,
  deleteResume,
  getpublicProfile,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

// Protected Routes

router.put("/profile", protect, updateProfile);
router.post("/resume", protect, deleteResume);

// Public Routes

router.get("/:id", getpublicProfile);

module.exports = router;
