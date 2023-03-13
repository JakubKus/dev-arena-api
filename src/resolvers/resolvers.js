const { GraphQLObjectType } = require('graphql');
const player = require('./player');
const fight = require('./fight');
const clothing = require('./clothing');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...player.queries,
    ...fight.queries,
    ...clothing.queries,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...player.mutations,
    ...fight.mutations,
    ...clothing.mutations,
  },
});

module.exports = { query, mutation };
