const mongoose = require('mongoose');

const comboTimes = mongoose.Schema({
  nickname: String,
  value: Number,
  establishedOn: Date,
});

module.exports = mongoose.model('comboTimes', comboTimes);
