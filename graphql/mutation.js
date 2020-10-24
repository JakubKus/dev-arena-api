const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');
const Clothing = require('./models/clothing');
const clothingType = require('./types/clothingType');
const bodyPartType = require('./types/bodyPartType');
const Enemy = require('./models/enemy');
const enemyType = require('./types/enemyType');
const Developer = require('./models/developer');
const developerType = require('./types/developerType');
const ComboTime = require('./models/combo-time');
const WonFight = require('./models/won-fight');
const highscoreType = require('./types/highscoreType');
const Player = require('./models/player');
const playerType = require('./types/playerType');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClothing: {
      type: clothingType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLFloat) },
        imageUrl: { type: GraphQLNonNull(GraphQLString) },
        bodyPart: { type: GraphQLNonNull(bodyPartType) },
      },
      resolve: (parent, args, { isAuth }) => isAuth ? Clothing.create(args) : null,
    },
    addEnemy: {
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
      resolve: (parent, args, { isAuth }) => isAuth ? Enemy.create(args) : null,
    },
    addDeveloper: {
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
      resolve: (parent, args, { isAuth }) => isAuth ? Developer.create(args) : null,
    },
    addComboTime: {
      type: highscoreType,
      args: {
        nickname: { type: GraphQLNonNull(GraphQLString) },
        value: { type: GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, { nickname, value }, { isAuth }) {
        if (!isAuth) return null;
        const comboTime = new ComboTime({
          nickname,
          value,
          establishedOn: new Date(),
        });
        let comboTimes = await ComboTime.find();
        if (comboTimes.length < 10) {
          return comboTime.save();
        }

        comboTimes = comboTimes.concat(comboTime);
        const LongestComboTime = Math.max(...comboTimes.map(x => x.value));
        const id = getIdToUpdate(LongestComboTime, comboTimes);
        return ComboTime.findByIdAndUpdate(id, { nickname, value, establishedOn: comboTime.establishedOn });
      },
    },
    addWonFight: {
      type: highscoreType,
      args: {
        nickname: { type: GraphQLNonNull(GraphQLString) },
        value: { type: GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parents, { nickname, value }, { isAuth }) {
        if (!isAuth) return null;
        const wonFight = new WonFight({
          nickname,
          value,
          establishedOn: new Date(),
        });
        let wonFights = await WonFight.find();
        if (wonFights.length < 10) {
          return wonFight.save();
        }

        wonFights = wonFights.concat(wonFight);
        const lowestWonFight = Math.min(...wonFights.map(x => x.value));
        const id = getIdToUpdate(lowestWonFight, wonFights);
        return WonFight.findByIdAndUpdate(id, { nickname, value, establishedOn: wonFight.establishedOn });
      },
    },
    addPlayer: {
      type: playerType,
      args: {
        nickname: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        cash: { type: GraphQLNonNull(GraphQLFloat) },
        wonFights: { type: GraphQLNonNull(GraphQLInt) },
        comboTime: { type: GraphQLNonNull(GraphQLInt) },
        chosenDevId: { type: GraphQLNonNull(GraphQLString) },
        equippedIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
        boughtIds: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
      },
      resolve: (parent, args, { isAuth }) => isAuth ? Player.create(args) : null,
    },
  },
});

const getIdToUpdate = (boundaryValue, values) => {
  const boundaryValues = values.filter(x => x.value === boundaryValue);
  let { id } = boundaryValues[0];

  if (boundaryValues.length > 1) {
    const latestTimestamp = Math.max(...boundaryValues.map(x => +x.establishedOn));
    const latestIndex = values.findIndex(x => +x.establishedOn === latestTimestamp);
    id = values[latestIndex].id;
  }

  return id;
};

module.exports = mutation;
