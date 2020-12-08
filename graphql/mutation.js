const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLID,
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
      resolve: (source, args, { isAuth }) => isAuth ? Clothing.create(args) : null,
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
      resolve: (source, args, { isAuth }) => isAuth ? Enemy.create(args) : null,
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
      resolve: (source, args, { isAuth }) => isAuth ? Developer.create(args) : null,
    },
    addComboTime: {
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
    },
    addWonFight: {
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
    },
    addPlayer: {
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
    },
    updatePlayer: {
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
        await Player.findOneAndUpdate({ nickname }, args);
        return Player.findOne({ nickname });
      },
    },
    equipItem: {
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
    },
  },
});

const getBoundaryValue = (values, operator) => Math[operator](...values.map(x => x.value));

module.exports = mutation;
