const mongoose = require('mongoose');

const clothing = mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  bodyPart: Number,
});

mongoose.pluralize(null);
module.exports = mongoose.model('clothing', clothing);
