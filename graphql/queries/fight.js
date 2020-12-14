const { GraphQLList, GraphQLString } = require('graphql');
const developerType = require('../types/developerType');
const highscoreType = require('../types/highscoreType');
const enemyType = require('../types/enemyType');
const Enemy = require('../models/enemy');
const WonFight = require('../models/won-fight');
const ComboTime = require('../models/combo-time');
const Developer = require('../models/developer');

const randomEnemy = {
  type: enemyType,
  resolve: async () => {
    const enemiesNumber = await Enemy.countDocuments();
    const enemiesToSkip = Math.floor(Math.random() * enemiesNumber);
    return Enemy.findOne().skip(enemiesToSkip);
  },
};

const defaultDeveloper = {
  type: developerType,
  resolve: () => Developer.findOne({ name: 'Programmer' }),
};

const developer = {
  type: developerType,
  args: {
    name: { type: GraphQLString },
  },
  resolve: (source, { name }) => Developer.findOne({ name }),
};

const allDevelopers = {
  type: GraphQLList(developerType),
  resolve: (source, args, { isAuth }) => isAuth ? Developer.find() : null,
};

const comboTimes = {
  type: GraphQLList(highscoreType),
  resolve: () => ComboTime.find().sort({ value: 1 }),
};

const wonFights = {
  type: GraphQLList(highscoreType),
  resolve: () => WonFight.find().sort({ value: -1 }),
};

module.exports = {
  randomEnemy,
  defaultDeveloper,
  developer,
  allDevelopers,
  comboTimes,
  wonFights,
};
