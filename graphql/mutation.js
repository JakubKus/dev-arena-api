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
const ComboTime = require('./models/combo-time');
const WonFight = require('./models/won-fight');
const highscoreType = require('./types/highscoreType');
const Player = require('./models/player');
const playerType = require('./types/playerType');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClothing:  {
      type: clothingType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        bodyPart: { type: new GraphQLNonNull(bodyPartType) }
      },
      resolve: (parent, { name, price, imageUrl, bodyPart }) =>
        Clothing.create({ name, price, imageUrl,bodyPart })
    },
    addEnemy: {
      type: enemyType,
      args: {
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
      resolve: (parents, { name, hp, damage, attackSpeed, quotes, avatarUrl }) =>
        Enemy.create({ name, hp, damage, attackSpeed, quotes, avatarUrl })
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
      resolve: (parents, { name, price, hp, damage, avatarUrl, weaponUrl }) =>
        Developer.create({ name, price, hp, damage, avatarUrl, weaponUrl })
    },
    addComboTime: {
      type: highscoreType,
      args: {
        nickname: { type: new GraphQLNonNull(GraphQLString) },
        value: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parents, { nickname, value }) {
        const comboTime = new ComboTime({
          nickname,
          value,
          establishedOn: new Date()
        });
        let comboTimes = await ComboTime.find();
        if (comboTimes.length < 10) {
          return comboTime.save();
        }

        comboTimes = comboTimes.concat(comboTime);
        const LongestComboTime = Math.max(...comboTimes.map(x => x.value));
        const id = getIdToUpdate(LongestComboTime, comboTimes)
        return ComboTime.findByIdAndUpdate(id, { nickname, value, establishedOn: comboTime.establishedOn });
      }
    },
    addWonFight: {
      type: highscoreType,
      args: {
        nickname: { type: new GraphQLNonNull(GraphQLString) },
        value: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parents, { nickname, value }) {
        const wonFight = new WonFight({
          nickname,
          value,
          establishedOn: new Date()
        });
        let wonFights = await WonFight.find();
        if (wonFights.length < 10) {
          return wonFight.save();
        }

        wonFights = wonFights.concat(wonFight);
        const lowestWonFight = Math.min(...wonFights.map(x => x.value));
        const id = getIdToUpdate(lowestWonFight, wonFights);
        return WonFight.findByIdAndUpdate(id, { nickname, value, establishedOn: wonFight.establishedOn });
      }
    },
    addPlayer: {
      type: playerType,
      args: {
        nickname: { type: GraphQLString },
        mail: { type: GraphQLString },
        cash: { type: GraphQLFloat },
        wonFights: { type: GraphQLInt },
        comboTime: { type: GraphQLInt },
        chosenDevId: { type: GraphQLString },
        equippedIds: { type: new GraphQLList(GraphQLString) },
        boughtIds: { type: new GraphQLList(GraphQLString) }
      },
      resolve: (parent, { nickname, mail, cash, wonFights, comboTime, chosenDevId, equippedIds, boughtIds }) =>
        Player.create({ nickname, mail, cash, wonFights, comboTime, chosenDevId, equippedIds, boughtIds })
    }
  }
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
}

module.exports = mutation;
