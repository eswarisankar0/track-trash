const express = require("express");
const router = express.Router();

const {
  createIssue,
  getMyIssues,
  getAllIssues,
  resolveIssue
} = require("../controllers/issueController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin, isUser } = require("../middleware/roleMiddleware");

// USER routes
router.post("/", verifyToken, isUser, createIssue);
router.get("/my", verifyToken, isUser, getMyIssues);

// ADMIN routes
router.get("/", verifyToken, isAdmin, getAllIssues);
router.put("/resolve/:id", verifyToken, isAdmin, resolveIssue);

module.exports = router;
