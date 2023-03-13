const { expressjwt: jwt } = require('express-jwt');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const jwks = require('jwks-rsa');
const cors = require('cors');

const resolvers = require('./resolvers/resolvers');

const {
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  AUTH0_JWKS_URI,
  CORS_ORIGIN,
} = process.env;

// cors set for origin with options method enabled
const handleCors = cors({
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
});

// auth0 jwt authentication
const jwtCheck = (err, req, res, next) => {
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: AUTH0_JWKS_URI,
    }),
    audience: AUTH0_AUDIENCE,
    issuer: AUTH0_ISSUER,
    algorithms: ['RS256'],
  })(err, req, res, next);

  const handleAuth = (err, req, res, next) => {
    req.isAuth = err.name !== 'UnauthorizedError';
    next();
  }

  return handleAuth(err, req, res, next);
}

// graphql initialization
const schema = new GraphQLSchema({
  query: resolvers.query,
  mutation: resolvers.mutation,
});

const connectGql = graphqlHTTP(req => ({
  schema,
  graphiql: true,
  context: { isAuth: req.isAuth !== false },
}));

module.exports = { handleCors, jwtCheck, connectGql };
