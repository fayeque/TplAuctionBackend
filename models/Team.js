// src/models/Team.js
const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    purseAmount: {
      type: Number,
      required: true,
    },
    availablePurse: {
      type: Number,
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      }
    ],
    totalPlayersBought: {
      type: Number,
      default: 0,
    },
    teamLogo: {
      type: String, // cloud link
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
