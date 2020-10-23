const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const playerType = new GraphQLObjectType({
  name: 'player',
  fields: () => ({
    id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    email: { type: GraphQLString },
    cash: { type: GraphQLFloat },
    wonFights: { type: GraphQLInt },
    comboTime: { type: GraphQLInt },
    chosenDevId: { type: GraphQLString },
    equippedIds: { type: new GraphQLList(GraphQLString) },
    boughtIds: { type: new GraphQLList(GraphQLString) }
  })
});

module.exports = playerType;
