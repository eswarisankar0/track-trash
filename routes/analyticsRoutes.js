const express = require("express");
const router = express.Router();

const {
  getCollectionStats,
  getCollectorStats,
  getIssueStats,
  getBinStats
} = require("../controllers/analyticsController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Admin only analytics
router.get("/collections", verifyToken, isAdmin, getCollectionStats);
router.get("/collector/:id", verifyToken, isAdmin, getCollectorStats);
router.get("/issues", verifyToken, isAdmin, getIssueStats);
router.get("/bins", verifyToken, isAdmin, getBinStats);

module.exports = router;
