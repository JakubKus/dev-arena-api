const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  level: Number,
  name: String,
  hp: Number,
  damage: {
    max: Number,
    min: Number
  },
  attackSpeed: Number,
  quotes: Array.of(String),
  avatarUrl: String
});

module.exports = mongo.model('enemies', schema);
