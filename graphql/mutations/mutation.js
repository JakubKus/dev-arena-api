const { GraphQLObjectType } = require('graphql');
const player = require('./player');
const fight = require('./fight');
const clothing = require('./clothing');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...player,
    ...fight,
    ...clothing,
  },
});

module.exports = mutation;
