require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const API = require('./datasources/api');
const internalEngineDemo = require('./engine-demo');

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  api: new API({ store }),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  return { };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  playground: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },
});

const port = process.env.PORT;

server.listen(port).then(() => {
  console.log(`
    Server is running!
    Listening on port ${port}
    Query at https://studio.apollographql.com/dev
  `);
});