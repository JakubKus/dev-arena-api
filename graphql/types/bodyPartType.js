const { GraphQLEnumType } = require('graphql');

const bodyPartType = new GraphQLEnumType({
  name: 'bodyPart',
  values: {
    top: { value: 0 },
    middle: { value: 1 },
    bottom: { value: 2 }
  }
});

module.exports = bodyPartType;
