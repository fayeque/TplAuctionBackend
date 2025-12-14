// src/routes/playerRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory
const uploadDir = path.join(__dirname, "..", "uploads", "players");



// 🔥 MUST exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

const {
  addPlayer,
  assignPlayerToTeam,
  getPlayerBySerialNo,
   getAllPlayersSummary,
  backupPlayers
} = require("../controllers/playerController");

router.post("/add", upload.single("picture"), addPlayer);
router.post("/assign", assignPlayerToTeam);
router.get("/:serialNo", getPlayerBySerialNo);

// 🔥 NEW BACKUP ROUTE
router.post("/backup", backupPlayers);
router.get("/summary/all", getAllPlayersSummary);

module.exports = router;
