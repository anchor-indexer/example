import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  gql as _gql,
  // ApolloProvider,
  // useQuery,
  // Reference,
  // makeVar,
} from '@apollo/client';

export const gql = _gql;

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // isLoggedIn: {
        //   read() {
        //     return isLoggedInVar();
        //   }
        // },
        // cartItems: {
        //   read() {
        //     return cartItemsVar();
        //   }
        // },
        // launches: {
        //   keyArgs: false,
        //   merge(existing, incoming) {
        //     let launches: Reference[] = [];
        //     if (existing && existing.launches) {
        //       launches = launches.concat(existing.launches);
        //     }
        //     if (incoming && incoming.launches) {
        //       launches = launches.concat(incoming.launches);
        //     }
        //     return {
        //       ...incoming,
        //       launches,
        //     };
        //   }
        // }
      },
    },
  },
});

// export const typeDefs = gql`
//   extend type Query {
//     isLoggedIn: Boolean!
//     cartItems: [ID!]!
//   }
// `;

// export const isLoggedInVar =
//   makeVar<boolean>(!!localStorage.getItem('token'));
// export const cartItemsVar = makeVar<string[]>([]);

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
  // typeDefs,
  resolvers: {},
});
