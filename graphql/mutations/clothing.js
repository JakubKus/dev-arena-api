const { GraphQLFloat, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql');
const clothingType = require('../types/clothingType');
const bodyPartType = require('../types/bodyPartType');
const playerType = require('../types/playerType');
const Player = require('../models/player');
const Clothing = require('../models/clothing');

const addClothing = {
  type: clothingType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    imageUrl: { type: GraphQLNonNull(GraphQLString) },
    bodyPart: { type: GraphQLNonNull(bodyPartType) },
  },
  resolve: (source, args, { isAuth }) => isAuth ? Clothing.create(args) : null,
};

const equipItem = {
  type: playerType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    toEquipId: { type: GraphQLNonNull(GraphQLID) },
    equippedIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
  },
  resolve: async (source, { nickname, toEquipId, equippedIds }, { isAuth }) => {
    if (!isAuth) return null;
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

module.exports = {
  addClothing,
  equipItem,
};
