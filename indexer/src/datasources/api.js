const { DataSource } = require('apollo-datasource');

class API extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async upsertCounter(authority, count) {
    let counter = await this.store.counters.findOne({ where: { authority } });
    if (counter) {
      counter.count = count;
      await counter.save();
    } else {
      counter = await this.store.counters.create({ authority, count });
    }
    return counter;
  }

  async getCounter(authority) {
    return await this.store.counters.findOne({ where: { authority } });
  }
}

module.exports = API;
