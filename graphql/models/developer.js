const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  name: String,
  price: Number,
  hp: Number,
  damage: {
    max: Number,
    min: Number,
  },
  avatarUrl: String,
  weaponUrl: String,
});

module.exports = mongo.model('developers', schema);
