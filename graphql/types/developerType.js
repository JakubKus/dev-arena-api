const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const developerType = new GraphQLObjectType({
  name: 'developer',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    hp: { type: GraphQLInt },
    damage: {
      type: new GraphQLObjectType({
        name: 'developerDamage',
        fields: {
          max: { type: GraphQLInt },
          min: { type: GraphQLInt }
        }
      })
    },
    avatarUrl: { type: GraphQLString },
    weaponUrl: { type: GraphQLString }
  })
});

module.exports = developerType;
