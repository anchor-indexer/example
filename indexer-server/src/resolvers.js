module.exports = {
  Query: {
    counter: (_, { authority }, { dataSources }) => {
      return dataSources.api.getCounter(authority);
    },
  },
  Mutation: {
    initializeCounter: async (_, { authority }, { dataSources }) => {
      const counter = await dataSources.api.createCounter(authority);
      return {
        success: true,
        message: 'ok',
        counter,
      };
    },
    updateCounter: async (_, { authority, count }, { dataSources }) => {
      const counter = await dataSources.api.updateCounter(authority, count);
      return {
        success: true,
        message: 'ok',
        counter,
      };
    },
  },
};
