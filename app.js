const express = require('express');

const { jwtCheck, connectGql, handleCors } = require('./src/middlewares');
const { connectWithDb } = require('./src/db-connection');

// .env variables
if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

connectWithDb();

const app = express();

app.use(
  '/graphql',
  handleCors,
  jwtCheck,
  connectGql,
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`api running on port ${port}`));
