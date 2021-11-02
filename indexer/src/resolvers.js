const { pubsub } = require('./utils');
const { withFilter } = require('graphql-subscriptions');

const COUNTER_CHANGED = 'COUNTER_CHANGED';

module.exports = {
  Query: {
    counter: (_, { authority }, { dataSources }) => {
      return dataSources.api.getCounter(authority);
    },
  },
  Mutation: {
    initializeCounter: async (_, { authority }, { dataSources }) => {
      const counter = await dataSources.api.upsertCounter(authority, 0);
      pubsub.publish('COUNTER_CHANGED', {
        counterChanged: {
          id: counter.id,
          count: counter.count,
          authority: counter.authority,
        },
      });
      return {
        success: true,
        message: 'ok',
        counter,
      };
    },
    updateCounter: async (_, { authority, count }, { dataSources }) => {
      const counter = await dataSources.api.upsertCounter(authority, count);
      pubsub.publish(COUNTER_CHANGED, {
        counterChanged: {
          id: counter.id,
          count: counter.count,
          authority: counter.authority,
        },
      });
      return {
        success: true,
        message: 'ok',
        counter,
      };
    },
    resetCounter: async (_, { authority }, { dataSources }) => {
      const counter = await dataSources.api.upsertCounter(authority, 0);
      pubsub.publish(COUNTER_CHANGED, {
        counterChanged: {
          id: counter.id,
          count: counter.count,
          authority: counter.authority,
        },
      });
      return {
        success: true,
        message: 'ok',
        counter,
      };
    },
  },
  Subscription: {
    counterChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(COUNTER_CHANGED),
        (payload, variables) => {
          return payload.counterChanged.authority === variables.authority;
        }
      ),
    },
  },
};
