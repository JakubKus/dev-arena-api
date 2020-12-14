const { GraphQLObjectType } = require('graphql');
const player = require('./player');
const fight = require('./fight');
const clothing = require('./clothing');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...player,
    ...fight,
    ...clothing,
  },
});

module.exports = query;
