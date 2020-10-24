const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull }
  = require('graphql');

const playerType = new GraphQLObjectType({
  name: 'player',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    nickname: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    cash: { type: GraphQLNonNull(GraphQLFloat) },
    wonFights: { type: GraphQLNonNull(GraphQLInt) },
    comboTime: { type: GraphQLNonNull(GraphQLInt) },
    chosenDevId: { type: GraphQLNonNull(GraphQLID) },
    equippedIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
    boughtIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
  },
});

module.exports = playerType;
