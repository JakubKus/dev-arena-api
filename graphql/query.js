const { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLInt } = require('graphql');
const Clothing = require('./models/clothing');
const clothingType = require('./types/clothingType');
const Enemy = require('./models/enemy');
const enemyType = require('./types/enemyType');
const Developer = require('./models/developer');
const developerType = require('./types/developerType');
const Highscore = require('./models/highscore');
const highscoreType = require('./types/highscoreType');
const scoreCategoryType = require('./types/scoreCategoryType');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    clothing: {
      type: new GraphQLList(clothingType),
      args: {
        ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
      },
      resolve(parent, args) {
        return Clothing.find({ _id: { $in: args.ids }})
      }
    },
    allClothing: {
      type: new GraphQLList(clothingType),
      resolve(parent, args) {
        return Clothing.find({});
      }
    },
    enemy: {
      type: enemyType,
      args: {
        level: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Enemy.findOne({ level: args.level });
      }
    },
    allEnemies: {
      type: new GraphQLList(enemyType),
      resolve(parent, args) {
        return Enemy.find({});
      }
    },
    developer: {
      type: developerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Developer.findOne({ _id: args.id });
      }
    },
    allDevelopers: {
      type: new GraphQLList(developerType),
      resolve(parent, args) {
        return Developer.find({});
      }
    },
    highscoresOfCategory: {
      type: new GraphQLList(highscoreType),
      args: {
        category: { type: new GraphQLNonNull(scoreCategoryType) }
      },
      resolve(parent, args) {
        // order asc 1/desc -1
        const categoryName = scoreCategoryType.serialize(args.category);
        const sortDirection = categoryName === 'combo' ? 1 : -1;
        return Highscore.find({ category: args.category }).sort({ value: sortDirection });
      }
    }
  }
});

module.exports = query;
