const { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString } = require('graphql');
const bodyPartType = require('./bodyPartType');

const clothingType = new GraphQLObjectType({
  name: 'clothing',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    imageUrl: { type: GraphQLString },
    bodyPart: { type: bodyPartType }
  })
});

module.exports = clothingType;
