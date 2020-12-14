const { GraphQLID, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLNonNull } = require('graphql');
const playerType = require('../types/playerType');
const Player = require('../models/player');

const addPlayer = {
  type: playerType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    cash: { type: GraphQLNonNull(GraphQLFloat) },
    wonFights: { type: GraphQLNonNull(GraphQLInt) },
    chosenDevName: { type: GraphQLNonNull(GraphQLString) },
    equippedIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
    boughtIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
  },
  resolve: (source, args, { isAuth }) => isAuth ? Player.create(args) : null,
};

const updatePlayer = {
  type: playerType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    cash: { type: GraphQLFloat },
    wonFights: { type: GraphQLInt },
    comboTime: { type: GraphQLInt },
    chosenDevName: { type: GraphQLString },
    boughtIds: { type: GraphQLList(GraphQLID) },
    equippedIds: { type: GraphQLList(GraphQLID) },
  },
  resolve: async (source, { nickname, ...args }, { isAuth }) => {
    if (!isAuth) return null;
    const player = await Player.findOne({ nickname });
    if (player.comboTime < args.comboTime) args.comboTime = player.comboTime;
    await Player.findOneAndUpdate({ nickname }, args);
    return Object.assign(player, args);
  },
};

module.exports = {
  addPlayer,
  updatePlayer,
};
