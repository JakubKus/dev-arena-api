const { GraphQLID, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLNonNull } = require('graphql');
const { playerType } = require('../gql-types/playerType');
const { Player } = require('../db-models/player');
const { validateAuth } = require('../utils');

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
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Player.create(args);
  }
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
  // resolve: async (source, { nickname, ...args }, { isAuth }) => {
  resolve: async (source, args, ctx) => {
    validateAuth(ctx);

    const { nickname } = args;
    let { comboTime } = args;

    const player = await Player.findOne({ nickname });
    if (player.comboTime < comboTime) comboTime = player.comboTime;
    await Player.findOneAndUpdate({ nickname }, { ...args, comboTime });

    return Object.assign(player, args);
  },
};

const mutations = {
  addPlayer,
  updatePlayer,
};

module.exports = { mutations };
