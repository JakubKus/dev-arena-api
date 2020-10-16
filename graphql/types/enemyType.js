const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const enemyType = new GraphQLObjectType({
  name: 'enemy',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    hp: { type: GraphQLInt },
    damage: {
      type: new GraphQLObjectType({
        name: 'enemyDamage',
        fields: {
          max: { type: GraphQLInt },
          min: { type: GraphQLInt }
        }
      })
    },
    attackSpeed: { type: GraphQLFloat },
    quotes: { type: new GraphQLList(GraphQLString) },
    avatarUrl: { type: GraphQLString }
  })
});

module.exports = enemyType;
