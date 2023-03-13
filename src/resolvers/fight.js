const {
  GraphQLList,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const { developerType } = require('../gql-types/developerType');
const { enemyType } = require('../gql-types/enemyType');
const { highscoreType } = require('../gql-types/highscoreType');
const { WonFight } = require('../db-models/won-fight');
const { ComboTime } = require('../db-models/combo-time');
const { validateAuth } = require('../utils');
const { Enemy } = require('../db-models/enemy');
const { Developer } = require('../db-models/developer');

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
  resolve: (source, args) => Developer.findOne({ name: args.name }),
};

const allDevelopers = {
  type: GraphQLList(developerType),
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Developer.find();
  }
};

const comboTimes = {
  type: GraphQLList(highscoreType),
  resolve: () => ComboTime.find().sort({ value: 1 }),
};

const wonFights = {
  type: GraphQLList(highscoreType),
  resolve: () => WonFight.find().sort({ value: -1 }),
};

const addEnemy = {
  type: enemyType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    hp: { type: GraphQLNonNull(GraphQLInt) },
    damage: {
      type: GraphQLNonNull(new GraphQLInputObjectType({
        name: 'enemyDamageInput',
        fields: {
          max: { type: GraphQLNonNull(GraphQLInt) },
          min: { type: GraphQLNonNull(GraphQLInt) },
        },
      })),
    },
    attackSpeed: { type: GraphQLNonNull(GraphQLFloat) },
    quotes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
    avatarUrl: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Enemy.create(args);
  },
};

const addDeveloper = {
  type: developerType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    hp: { type: GraphQLNonNull(GraphQLInt) },
    damage: {
      type: GraphQLNonNull(new GraphQLInputObjectType({
        name: 'developerDamageInput',
        fields: {
          max: { type: GraphQLNonNull(GraphQLInt) },
          min: { type: GraphQLNonNull(GraphQLInt) },
        },
      })),
    },
    avatarUrl: { type: GraphQLNonNull(GraphQLString) },
    weaponUrl: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (source, args, ctx) => {
    validateAuth(ctx);
    return Developer.create(args);
  }
};

const addComboTime = {
  type: highscoreType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (source, args, ctx) => {
    validateAuth(ctx);

    const { nickname, value, establishedOn = new Date() } = args;
    args = { nickname, value, establishedOn };

    const comboTimes = await ComboTime.find();
    const [prevScore] = comboTimes.filter(x => x.nickname === nickname);

    if (prevScore) return value < prevScore.value ? ComboTime.findByIdAndUpdate(prevScore.id, args) : null;
    if (comboTimes.length < 10) return ComboTime.create(args);

    const longestComboTime = getBoundaryValue(comboTimes, 'max');
    if (value >= longestComboTime) return null;
    const [{ id }] = comboTimes.filter(x => x.value === longestComboTime);

    return ComboTime.findByIdAndUpdate(id, args);
  },
};

const addWonFight = {
  type: highscoreType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (source, args, ctx) => {
    validateAuth(ctx);

    const { nickname, value, establishedOn = new Date() } = args;
    args = { nickname, value, establishedOn };

    const wonFights = await WonFight.find();
    const [prevScore] = wonFights.filter(x => x.nickname === nickname);

    if (prevScore) return value > prevScore.value ? WonFight.findByIdAndUpdate(prevScore.id, args) : null;
    if (wonFights.length < 10) return WonFight.create(args);

    const lowestWonFights = getBoundaryValue(wonFights, 'min');
    if (value <= lowestWonFights) return null;
    const [{ id }] = wonFights.filter(x => x.value === lowestWonFights);

    return WonFight.findByIdAndUpdate(id, args);
  },
};

const getBoundaryValue = (values, operator) => Math[operator](...values.map(x => x.value));

const queries = {
  randomEnemy,
  defaultDeveloper,
  developer,
  allDevelopers,
  comboTimes,
  wonFights,
}

const mutations = {
  addEnemy,
  addDeveloper,
  addComboTime,
  addWonFight,
};

module.exports = { queries, mutations };
