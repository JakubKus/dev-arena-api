const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const clothingType = require('../types/clothingType');
const Clothing = require('../models/clothing');

const clothing = {
  type: GraphQLList(clothingType),
  args: {
    ids: { type: GraphQLList(GraphQLNonNull(GraphQLID)) },
  },
  resolve: (source, { ids }, { isAuth }) => isAuth ? Clothing.find({ _id: { $in: ids } }) : null,
};

const allClothing = {
  type: GraphQLList(clothingType),
  resolve: (source, args, { isAuth }) => isAuth ? Clothing.find() : null,
};

module.exports = {
  clothing,
  allClothing,
};
