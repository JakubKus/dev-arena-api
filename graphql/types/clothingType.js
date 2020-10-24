const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const bodyPartType = require('./bodyPartType');

const clothingType = new GraphQLObjectType({
  name: 'clothing',
    fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    imageUrl: { type: GraphQLNonNull(GraphQLString) },
    bodyPart: { type: GraphQLNonNull(bodyPartType) },
  },
});

module.exports = clothingType;
