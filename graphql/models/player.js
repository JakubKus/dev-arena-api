const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  nickname: String,
  email: String,
  cash: Number,
  wonFights: Number,
  comboTime: Number,
  chosenDevId: String,
  equippedIds: Array.of(String),
  boughtIds: Array.of(String),
});

module.exports = mongo.model('player', schema);
