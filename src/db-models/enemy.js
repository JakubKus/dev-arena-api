const mongoose = require('mongoose');

const enemies = mongoose.Schema({
  name: String,
  hp: Number,
  damage: {
    max: Number,
    min: Number,
  },
  attackSpeed: Number,
  quotes: Array.of(String),
  avatarUrl: String,
});

module.exports = { Enemy: mongoose.model('enemies', enemies) };
