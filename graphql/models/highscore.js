const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  nickname: String,
  value: Number,
  establishedOn: Date,
  category: Number
});

module.exports = mongo.model('highscores', schema);
