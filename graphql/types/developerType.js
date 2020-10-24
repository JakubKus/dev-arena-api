const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const developerType = new GraphQLObjectType({
  name: 'developer',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    hp: { type: GraphQLNonNull(GraphQLInt) },
    damage: {
      type: GraphQLNonNull(new GraphQLObjectType({
        name: 'developerDamage',
        fields: {
          max: { type: GraphQLNonNull(GraphQLInt) },
          min: { type: GraphQLNonNull(GraphQLInt) },
        },
      })),
    },
    avatarUrl: { type: GraphQLNonNull(GraphQLString) },
    weaponUrl: { type: GraphQLNonNull(GraphQLString) },
  },
});

module.exports = developerType;
