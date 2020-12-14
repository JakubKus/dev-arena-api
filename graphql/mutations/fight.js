const {
  GraphQLList,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const developerType = require('../types/developerType');
const enemyType = require('../types/enemyType');
const highscoreType = require('../types/highscoreType');
const WonFight = require('../models/won-fight');
const ComboTime = require('../models/combo-time');

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
  resolve: (source, args, { isAuth }) => isAuth ? Enemy.create(args) : null,
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
  resolve: (source, args, { isAuth }) => isAuth ? Developer.create(args) : null,
};

const addComboTime = {
  type: highscoreType,
  args: {
    nickname: { type: GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (source, { nickname, value, establishedOn = new Date() }, { isAuth }) => {
    if (!isAuth) return null;
    const args = { nickname, value, establishedOn };
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
  resolve: async (source, { nickname, value, establishedOn = new Date() }, { isAuth }) => {
    if (!isAuth) return null;
    const args = { nickname, value, establishedOn };
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

module.exports = {
  addEnemy,
  addDeveloper,
  addComboTime,
  addWonFight,
};
