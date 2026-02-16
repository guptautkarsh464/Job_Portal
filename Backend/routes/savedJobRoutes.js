const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobController");

router.get("/test", (req, res) => {
  res.json({ message: "SavedJob router working!" });
});

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/my", protect, getMySavedJobs);

module.exports = router;
