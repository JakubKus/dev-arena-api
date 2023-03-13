const { GraphQLFloat, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql');
const { clothingType } = require('../gql-types/clothingType');
const { bodyPartType } = require('../gql-types/bodyPartType');
const { playerType } = require('../gql-types/playerType');
const { Player } = require('../db-models/player');
const { Clothing } = require('../db-models/clothing');
const { validateAuth } = require('../utils');

const clothing = {
  type: GraphQLList(clothingType),
  args: {
    ids: { type: GraphQLList(GraphQLNonNull(GraphQLID)) },
  },
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    const { ids } = args;
    return Clothing.find({ _id: { $in: ids } });
  },
};

const allClothing = {
  type: GraphQLList(clothingType),
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Clothing.find();
  },
};

const addClothing = {
  type: clothingType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    imageUrl: { type: GraphQLNonNull(GraphQLString) },
    bodyPart: { type: GraphQLNonNull(bodyPartType) },
  },
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Clothing.create(args);
  },
};

const equipItem = {
  type: playerType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    toEquipId: { type: GraphQLNonNull(GraphQLID) },
    equippedIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
  },
  resolve: async (source, args, ctx) => {
    validateAuth(ctx);
    const { nickname, toEquipId, equippedIds } = args;

    if (equippedIds.length === 0) {
      await Player.findOneAndUpdate({ nickname }, { equippedIds: [toEquipId] });
      return Player.findOne({ nickname });
    }

    const { bodyPart } = await Clothing.findById(toEquipId);
    const equippedOfType = await Clothing.findOne({ _id: { $in: equippedIds }, bodyPart });
    if (!equippedOfType) {
      await Player.findOneAndUpdate({ nickname }, { equippedIds: equippedIds.concat(toEquipId) });
      return Player.findOne({ nickname });
    }

    const equippedClothingIndex = equippedIds.indexOf(equippedOfType.id);
    equippedIds.splice(equippedClothingIndex, 1, toEquipId);
    await Player.findOneAndUpdate({ nickname }, { equippedIds });
    return Player.findOne({ nickname });
  },
};

const queries = {
  clothing,
  allClothing,
}

const mutations = {
  addClothing,
  equipItem,
};

module.exports = { queries, mutations };
