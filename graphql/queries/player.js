const { GraphQLString, GraphQLNonNull } = require('graphql');
const playerType = require('../types/playerType');
const Player = require('../models/player');

const player = {
  type: playerType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (source, { email }, { isAuth }) => isAuth ? Player.findOne({ email }) : null,
};

module.exports.player = player;
