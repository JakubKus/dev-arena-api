const mongo = require('mongoose');
const Schema = mongo.Schema;

const schema = new Schema({
  nickname: String,
  value: Number,
  establishedOn: Date,
});

module.exports = mongo.model('wonFights', schema);
