const express = require("express");
const router = express.Router();

const {
  assignBin,
  getAllCollections,
  getMyCollections,
  completeCollection
} = require("../controllers/collectionController");

const { verifyToken } = require("../middleware/authMiddleware");


const { isAdmin, isCollector } = require("../middleware/roleMiddleware");

// Admin only
router.post("/assign", verifyToken, isAdmin, assignBin);
router.get("/", verifyToken, isAdmin, getAllCollections);

// Collector only
router.get("/my", verifyToken, isCollector, getMyCollections);
router.put("/complete/:id", verifyToken, isCollector, completeCollection);

module.exports = router;