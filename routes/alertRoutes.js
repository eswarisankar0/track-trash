const express = require("express");
const router = express.Router();

const { 
  getAllAlerts, 
  getAlertsByBin 
} = require("../controllers/alertController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Admin: all alerts
router.get("/", verifyToken, isAdmin, getAllAlerts);

// Admin: alerts for a specific bin
router.get("/bin/:binId", verifyToken, isAdmin, getAlertsByBin);

module.exports = router;
