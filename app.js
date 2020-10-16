const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const { GraphQLSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const mongo = require('mongoose');
const query = require('./graphql/query');
const mutation = require('./graphql/mutation');
if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

const app = express();
const { PORT, AUTH0_AUDIENCE, AUTH0_ISSUER, AUTH0_JWKS_URI, MONGO_USER, MONGO_PW, MONGO_CLUSTER } = process.env;
const port = PORT || 5000;

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_ISSUER,
  algorithms: ['RS256']
});

app.use(cors());
app.use(jwtCheck);

const schema = new GraphQLSchema({
  mutation,
  query,
});

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;

mongo.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongo.connection.once('open', () => {
  console.log('connected to database');
});

mongo.set('useFindAndModify', false);
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(port, () => console.log(`api running on port ${port}`));
