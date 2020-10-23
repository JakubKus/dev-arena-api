const cors = require('cors');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('express-jwt');
const { GraphQLSchema } = require('graphql');
const jwks = require('jwks-rsa');
const mongo = require('mongoose');
const query = require('./graphql/query');
const mutation = require('./graphql/mutation');

if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

const schema = new GraphQLSchema({
  mutation,
  query,
});
const { PORT, AUTH0_AUDIENCE, AUTH0_ISSUER, AUTH0_JWKS_URI, MONGO_USER, MONGO_PW, MONGO_CLUSTER } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;

mongo.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongo.connection.once('open', () => {
  console.log('connected to database');
});

mongo.set('useFindAndModify', false);

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_ISSUER,
  algorithms: ['RS256'],
});

const app = express();
app.use(
  '/graphql',
  cors(),
  jwtCheck,
  (err, req, res, next) => {
    req.isAuth = err.name !== 'UnauthorizedError';
    next();
  },
  graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: { isAuth: req.isAuth !== false }
  })),
);

const port = PORT || 5000;
app.listen(port, () => console.log(`api running on port ${port}`));
