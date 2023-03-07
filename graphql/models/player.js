const mongoose = require('mongoose');

const players = mongoose.Schema({
  nickname: String,
  email: String,
  cash: Number,
  wonFights: Number,
  comboTime: Number,
  chosenDevName: String,
  equippedIds: Array.of(String),
  boughtIds: Array.of(String),
});

module.exports = mongoose.model('players', players);
