const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql');
const Clothing = require('./models/clothing');
const clothingType = require('./types/clothingType');
const bodyPartType = require('./types/bodyPartType');
const Enemy = require('./models/enemy');
const enemyType = require('./types/enemyType');
const Developer = require('./models/developer');
const developerType = require('./types/developerType');
const Highscore = require('./models/highscore');
const highscoreType = require('./types/highscoreType');
const scoreCategoryType = require('./types/scoreCategoryType');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClothing: {
      type: clothingType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        bodyPart: { type: new GraphQLNonNull(bodyPartType) }
      },
      resolve(parent, args) {
        const clothing = new Clothing({
          name: args.name,
          price: args.price,
          imageUrl: args.imageUrl,
          bodyPart: args.bodyPart
        });
        return clothing.save();
      }
    },
    addEnemy: {
      type: enemyType,
      args: {
        level: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        hp: { type: new GraphQLNonNull(GraphQLInt) },
        damage: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'enemyDamageInput',
            fields: {
              max: { type: new GraphQLNonNull(GraphQLInt) },
              min: { type: new GraphQLNonNull(GraphQLInt) }
            }
          }))
        },
        attackSpeed: { type: new GraphQLNonNull(GraphQLFloat) },
        quotes: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        avatarUrl: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parents, args) {
        const enemy = new Enemy({
          level: args.level,
          name: args.name,
          hp: args.hp,
          damage: args.damage,
          attackSpeed: args.attackSpeed,
          quotes: args.quotes,
          avatarUrl: args.avatarUrl
        });
        return enemy.save();
      }
    },
    addDeveloper: {
      type: developerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        hp: { type: new GraphQLNonNull(GraphQLInt) },
        damage: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'developerDamageInput',
            fields: {
              max: { type: new GraphQLNonNull(GraphQLInt) },
              min: { type: new GraphQLNonNull(GraphQLInt) }
            }
          }))
        },
        avatarUrl: { type: new GraphQLNonNull(GraphQLString) },
        weaponUrl: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parents, args) {
        const developer = new Developer({
          name: args.name,
          price: args.price,
          hp: args.hp,
          damage: args.damage,
          avatarUrl: args.avatarUrl,
          weaponUrl: args.weaponUrl
        });
        return developer.save();
        // return await Developer.create({})
      }
    },
    addHighscore: {
      type: highscoreType,
      args: {
        nickname: { type: new GraphQLNonNull(GraphQLString) },
        value: { type: new GraphQLNonNull(GraphQLFloat) },
        category: { type: new GraphQLNonNull(scoreCategoryType) }
      },
      async resolve(parents, args) {
        const highscore = new Highscore({
          nickname: args.nickname,
          value: args.value,
          establishedOn: new Date(),
          category: args.category
        });
        let highscoresOfCategory = await Highscore.find({ category: args.category });
        highscoresOfCategory = highscoresOfCategory.concat(highscore);
        if (highscoresOfCategory.length <= 3) {
          return highscore.save();
        }
        const { nickname, value, establishedOn } = highscore;

        const categoryName = scoreCategoryType.serialize(args.category);
        const boundaryDirection = categoryName === 'combo' ? 'max' : 'min'
        const boundaryHighscoreValue = Math[boundaryDirection](...highscoresOfCategory.map(x => x.value));
        const boundaryHighscores = highscoresOfCategory.filter(x => x.value === boundaryHighscoreValue);
        let { id } = boundaryHighscores[0];

        if (boundaryHighscores.length > 1) {
          const latestTimestamp = Math.max(...boundaryHighscores.map(x => +x.establishedOn));
          const latestIndex = highscoresOfCategory.findIndex(x => +x.establishedOn === latestTimestamp);
          id = highscoresOfCategory[latestIndex].id;
        }

        return Highscore.findByIdAndUpdate(id, { nickname, value, establishedOn });
      }
    }
  }
});

module.exports = mutation;
