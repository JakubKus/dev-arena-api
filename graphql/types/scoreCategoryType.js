const { GraphQLEnumType } = require('graphql');

const scoreCategoryType = new GraphQLEnumType({
  name: 'scoreCategory',
  values: {
    combo: { value: 0 },
    wonFights: { value: 1 },
  }
});

module.exports = scoreCategoryType;
