// src/controllers/playerController.js
const Player = require("../models/Player");
const Team = require("../models/Team");
const mongoose = require("mongoose");


exports.addPlayer = async (req, res) => {
  try {
    const pictureUrl = req.file
      ? `/uploads/players/${req.file.filename}`
      : null;


    const player = await Player.create({
      serialNo: req.body.serialNo,
      playerName: req.body.playerName,
      role: req.body.role,
      wicketKeeper: req.body.wicketKeeper,
      pictureUrl,
      age: req.body.age,
    });

    const playerData = new Player(player);
    await playerData.save();

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.assignPlayerToTeam = async (req, res) => {
  try {
    const { playerId, teamId, soldPrice } = req.body; 

    const player = await Player.findById(playerId);
    const team = await Team.findById(teamId);

    if (!player || !team)
      return res.status(404).json({ error: "Invalid player or team" });

    if (team.availablePurse < soldPrice)
      return res.status(400).json({ error: "Not enough purse amount" });

    // Update player
    player.soldTo = teamId;
    player.soldPrice = soldPrice;
    await player.save();

    // Update team
    team.players.push(playerId);
    team.totalPlayersBought += 1;
    team.availablePurse -= soldPrice;
    await team.save();

    res.json({ success: true, message: "Player assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPlayerBySerialNo = async (req, res) => {
  try {
    const { serialNo } = req.params;

    const player = await Player.findOne({ serialNo: serialNo });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getAllPlayersSummary = async (req, res) => {
  try {
    const players = await Player.find()
      .populate("soldTo", "teamName")
      .select("playerName age soldPrice pictureUrl soldTo")
      .lean();

    const response = players.map((player) => ({
      playerName: player.playerName,
      age: player.age ?? null,
      soldPrice:
        player.soldPrice && player.soldPrice > 0
          ? player.soldPrice
          : "Yet to be sold",
      pictureUrl: player.pictureUrl ?? null,
      teamName: player.soldTo?.teamName || "Unsold",
    }));

    res.status(200).json({
      success: true,
      totalPlayers: response.length,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching players summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch players",
    });
  }
};



exports.backupPlayers = async (req, res) => {
  try {
    const players = await Player.find().lean();

    if (!players.length) {
      return res.status(404).json({
        success: false,
        message: "No players found to backup",
      });
    }

    const dateSuffix = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    const backupCollectionName = "players_backup";

    const BackupModel = mongoose.model(
      backupCollectionName,
      new mongoose.Schema({}, { strict: false }),
      backupCollectionName
    );

    await BackupModel.insertMany(players);

    res.status(201).json({
      success: true,
      message: "Player backup created successfully",
      backupCollection: backupCollectionName,
      totalRecords: players.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to create player backup",
    });
  }
};
