const mongoose = require('mongoose');

const connectWithDb = () => {
  const {
    MONGO_USER,
    MONGO_PW,
    MONGO_CLUSTER,
  } = process.env;

  const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('connected to database');
  });
};

module.exports = { connectWithDb };
