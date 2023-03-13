const mongoose = require('mongoose');

const comboTimes = mongoose.Schema({
  nickname: String,
  value: Number,
  establishedOn: Date,
});

module.exports = { ComboTime: mongoose.model('comboTimes', comboTimes) };
