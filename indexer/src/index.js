require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore, pubsub } = require('./utils');
const API = require('./datasources/api');
const internalEngineDemo = require('./engine-demo');

main().then(
  () => {},
  (err) => {
    console.log(err);
    process.exit(-1);
  }
);

async function main() {
  // creates a sequelize connection once. NOT for every request
  const store = createStore();

  // set up any dataSources our resolvers need
  const dataSources = () => ({
    api: new API({ store }),
  });

  // the function that sets up the global context for each resolver, using the req
  const context = async ({ req }) => {
    return {};
  };

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    dataSources,
    context,
    introspection: true,
    playground: true,
    engine: {
      apiKey: process.env.ENGINE_API_KEY,
      ...internalEngineDemo,
    },
    // plugins: [
    //   {
    //     async serverWillStart() {
    //       return {
    //         async drainServer() {
    //           subscriptionServer.close();
    //         },
    //       };
    //     },
    //   },
    // ],
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  const PORT = process.env.PORT;

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
}
