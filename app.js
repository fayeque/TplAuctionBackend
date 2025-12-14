// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

/* 🔥 ALLOW ALL ORIGINS */
app.use(cors());
app.options("*", cors());

const playerRoutes = require("./routes/playerRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


app.use("/api/player", playerRoutes);
app.use("/api/team", teamRoutes);

module.exports = app;
