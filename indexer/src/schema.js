const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    counter(authority: String!): Counter
  }

  type Mutation {
    initializeCounter(authority: String!): Response!
    updateCounter(authority: String!, count: Int!): Response!
    resetCounter(authority: String!): Response!
  }

  type Subscription {
    counterChanged(authority: String!): Counter
  }

  type Response {
    success: Boolean!
    message: String
    counter: Counter
  }

  type Counter {
    id: ID!
    authority: String!
    count: Int!
  }
`;

module.exports = typeDefs;
