const mongoose = require('mongoose');

const developers = mongoose.Schema({
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

module.exports = mongoose.model('developers', developers);
