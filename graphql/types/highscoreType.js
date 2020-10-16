const { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString } = require('graphql');
const { GraphQLDateTime } = require ('graphql-iso-date');

const highscoreType = new GraphQLObjectType({
  name: 'highscores',
  fields: () => ({
    id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    value: { type: GraphQLInt },
    establishedOn: { type: GraphQLDateTime },
  })
});

module.exports = highscoreType;
