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
      type: new GraphQLList(clothingType),
      args: {
        ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
      },
      resolve: (parent, { ids }, { isAuth }) => isAuth ? Clothing.find({ _id: { $in: ids } }) : null
    },
    allClothing: {
      type: new GraphQLList(clothingType),
      resolve: (parent, args, { isAuth }) => isAuth ? Clothing.find() : null
    },
    randomEnemy: {
      type: enemyType,
      async resolve() {
        const enemiesNumber = await Enemy.countDocuments();
        const enemiesToSkip = Math.floor(Math.random() * enemiesNumber);
        return Enemy.findOne().skip(enemiesToSkip);
      }
    },
    developer: {
      type: developerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, { id }) => Developer.findOne({ _id: id })
    },
    allDevelopers: {
      type: new GraphQLList(developerType),
      resolve: (parent, args, { isAuth }) => isAuth ? Developer.find() : null
    },
    comboTimes: {
      type: new GraphQLList(highscoreType),
      resolve: () => ComboTime.find().sort({ value: 1 })
    },
    wonFights: {
      type: new GraphQLList(highscoreType),
      resolve: () => WonFight.find().sort({ value: -1 })
    },
    player: {
      type: playerType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, { email }, { isAuth }) => isAuth ? Player.findOne({ email }) : null
    }
  }
});

module.exports = query;
