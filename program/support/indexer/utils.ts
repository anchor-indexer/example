import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';

export const client = new ApolloClient({
  uri: 'http://localhost:5300/graphql',
  fetch,
});
