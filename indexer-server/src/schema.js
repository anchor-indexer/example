const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    counter(authority: String!): Counter
  }

  type Mutation {
    initializeCounter(authority: String!): Response!
    updateCounter(authority: String!, count: Int!): Response!
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
