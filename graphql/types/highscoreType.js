const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString } = require('graphql');
const { GraphQLDateTime } = require ('graphql-iso-date');
const scoreCategoryType = require ('./scoreCategoryType');

const highscoreType = new GraphQLObjectType({
  name: 'highscores',
  fields: () => ({
    id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    value: { type: GraphQLFloat },
    establishedOn: { type: GraphQLDateTime },
    category: { type: scoreCategoryType }
  })
});

module.exports = highscoreType;
