const express = require("express");
const router = express.Router();
const multer = require("multer");

const { classifyWaste } = require("../controllers/wasteClassificationController");

// multer setup
const upload = multer({ dest: "uploads/" });

router.post("/classify", upload.single("file"), classifyWaste);

module.exports = router;