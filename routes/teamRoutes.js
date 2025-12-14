// src/routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory → uploads/teams
const uploadDir = path.join(__dirname, "..", "uploads", "teams");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage (no limits, no filters)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const {
  addTeam,
  getAllTeams,
  getTeamById,
  getPlayersByTeamId,
  backupTeams
} = require("../controllers/teamController");

// Routes
router.post("/add", upload.single("logo"), addTeam);
router.get("/all", getAllTeams);

// Get team details
router.get("/:teamId", getTeamById);

// Get players of a team
router.get("/:teamId/players", getPlayersByTeamId);

// 🔥 BACKUP ROUTE
router.post("/backup", backupTeams);

module.exports = router;
