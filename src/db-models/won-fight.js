const mongoose = require('mongoose');

const wonFights = mongoose.Schema({
  nickname: String,
  value: Number,
  establishedOn: Date,
});

module.exports = { WonFight: mongoose.model('wonFights', wonFights) };
