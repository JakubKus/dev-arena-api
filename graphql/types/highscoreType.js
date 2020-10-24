const { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const highscoreType = new GraphQLObjectType({
  name: 'highscores',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    nickname: { type: GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLNonNull(GraphQLInt) },
    establishedOn: { type: GraphQLNonNull(GraphQLDateTime) },
  },
});

module.exports = highscoreType;
