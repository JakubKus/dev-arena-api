const { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');
const Clothing = require('./models/clothing');
const clothingType = require('./types/clothingType');
const Enemy = require('./models/enemy');
const enemyType = require('./types/enemyType');
const Developer = require('./models/developer');
const developerType = require('./types/developerType');
const ComboTime = require('./models/combo-time');
const WonFight = require('./models/won-fight');
const highscoreType = require('./types/highscoreType');
const Player = require('./models/player');
const playerType = require('./types/playerType');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    clothing: {
      type: GraphQLList(clothingType),
      args: {
        ids: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
      },
      // TODO: check find $in null
      resolve: (source, { ids }, { isAuth }) => isAuth ? Clothing.find({ _id: { $in: ids } }) : null,
    },
    allClothing: {
      type: GraphQLList(clothingType),
      resolve: (source, args, { isAuth }) => isAuth ? Clothing.find() : null,
    },
    randomEnemy: {
      type: enemyType,
      resolve: async () => {
        const enemiesNumber = await Enemy.countDocuments();
        const enemiesToSkip = Math.floor(Math.random() * enemiesNumber);
        return Enemy.findOne().skip(enemiesToSkip);
      },
    },
    defaultDeveloper: {
      type: developerType,
      resolve: () => Developer.findOne({ name: 'Programmer' }),
    },
    developer: {
      type: developerType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: (source, { name }) => Developer.findOne({ name }),
    },
    allDevelopers: {
      type: GraphQLList(developerType),
      resolve: (source, args, { isAuth }) => isAuth ? Developer.find() : null,
    },
    comboTimes: {
      type: GraphQLList(highscoreType),
      resolve: () => ComboTime.find().sort({ value: 1 }),
    },
    wonFights: {
      type: GraphQLList(highscoreType),
      resolve: () => WonFight.find().sort({ value: -1 }),
    },
    player: {
      type: playerType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (source, { email }, { isAuth }) => isAuth ? Player.findOne({ email }) : null,
    },
  },
});

module.exports = query;
