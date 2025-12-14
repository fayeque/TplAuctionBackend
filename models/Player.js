// src/models/Player.js
const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    serialNo: {
      type: Number,
      required: true,
      unique: true,
    },
    playerName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Batsman", "Bowler", "Allrounder"],
      default: "Allrounder",
    },
    wicketKeeper: {
      type: String,
      default: "True",
    },
    pictureUrl: {
      type: String, // Store cloud link
    },
    basePrice: {
      type: Number,
      default: 50
    },
    age: {
      type: Number,
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    soldPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", PlayerSchema);
