const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  name: String,
  price: Number,
  imageUrl: String,
  bodyPart: Number,
});

mongo.pluralize(null);
module.exports = mongo.model('clothing', schema);
