const { GraphQLError } = require('graphql');

const validateAuth = ctx => {
  if (!ctx.isAuth) throw new GraphQLError('Not authorized');
}

module.exports = { validateAuth }
