const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } =
  require('graphql');

const enemyType = new GraphQLObjectType({
  name: 'enemy',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    hp: { type: GraphQLNonNull(GraphQLInt) },
    damage: {
      type: GraphQLNonNull(new GraphQLObjectType({
        name: 'enemyDamage',
        fields: {
          max: { type: GraphQLNonNull(GraphQLInt) },
          min: { type: GraphQLNonNull(GraphQLInt) },
        },
      })),
    },
    attackSpeed: { type: GraphQLNonNull(GraphQLFloat) },
    quotes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
    avatarUrl: { type: GraphQLNonNull(GraphQLString) },
  },
});

module.exports = enemyType;
