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
      resolve: (parent, { ids }) => Clothing.find({ _id: { $in: ids }})
    },
    allClothing: {
      type: new GraphQLList(clothingType),
      resolve: (parent, args) => Clothing.find()
    },
    randomEnemy: {
      type: enemyType,
      async resolve(parent, args) {
        const enemiesNumber = await Enemy.countDocuments();
        const enemiesToSkip =  Math.floor(Math.random() * enemiesNumber);
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
      resolve: (parent, args) => Developer.find()
    },
    comboTimes: {
      type: new GraphQLList(highscoreType),
      resolve: (parent, args) => ComboTime.find().sort({ value: 1 })
    },
    wonFights: {
      type: new GraphQLList(highscoreType),
      resolve: (parent, args) => WonFight.find().sort({ value: -1 })
    },
    player: {
      type: playerType,
      args: {
        mail: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, { mail }) => Player.findOne({ mail })
    }
  }
});

module.exports = query;
