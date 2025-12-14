// src/controllers/teamController.js
const Team = require("../models/Team");
const Player = require("../models/Player");
const mongoose = require("mongoose");

exports.addTeam = async (req, res) => {
  try {
    console.log("req.teamName",req.body.teamName)

        const logoUrl = req.file
      ? `/uploads/teams/${req.file.filename}`
      : null;


    const team = await Team.create({
      teamName: req.body.teamName,
      ownerName: req.body.ownerName,
      purseAmount: req.body.purseAmount,
      availablePurse: req.body.purseAmount,
      teamLogo: logoUrl
    });

    const teamData = new Team(team)
    await teamData.save()
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/team/:teamId
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/team/:teamId/players
exports.getPlayersByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    console.log(teamId);

    const players = await Player.find({ soldTo : teamId });

    console.log("players are ", players)

    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.backupTeams = async (req, res) => {
  try {
    const teams = await Team.find().lean();

    if (!teams.length) {
      return res.status(404).json({
        success: false,
        message: "No teams found to backup",
      });
    }

    const dateSuffix = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    const backupCollectionName = "teams_backup";

    const BackupModel = mongoose.model(
      backupCollectionName,
      new mongoose.Schema({}, { strict: false }),
      backupCollectionName
    );

    await BackupModel.insertMany(teams);

    res.status(201).json({
      success: true,
      message: "Team backup created successfully",
      backupCollection: backupCollectionName,
      totalRecords: teams.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to create team backup",
    });
  }
};
