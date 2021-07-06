import * as anchor from '@project-serum/anchor';
import { gql } from 'apollo-boost';
import { client } from './utils';

main();

async function main() {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;

  program.addEventListener('InitializeCounterEvent', (data) => {
    console.log('init', data);

    client.mutate({
      mutation: INITIALIZE_COUNTER_GQL,
      variables: {
        authority: data.authority.toString(),
      },
    });
  });

  program.addEventListener('IncrementCounterEvent', (data) => {
    console.log('+', data);

    client.mutate({
      mutation: UPDATE_COUNTER_GQL,
      variables: {
        authority: data.authority.toString(),
        count: data.count.toNumber(),
      },
    });
  });

  program.addEventListener('DecrementCounterEvent', (data) => {
    console.log('-', data);

    client.mutate({
      mutation: UPDATE_COUNTER_GQL,
      variables: {
        authority: data.authority.toString(),
        count: data.count.toNumber(),
      },
    });
  });
}

const INITIALIZE_COUNTER_GQL = gql`
  mutation ($authority: String!) {
    initializeCounter(authority: $authority) {
      counter {
        id
        authority
        count
      }
    }
  }
`;

const UPDATE_COUNTER_GQL = gql`
  mutation ($authority: String!, $count: Int!) {
    updateCounter(authority: $authority, count: $count) {
      counter {
        id
        authority
        count
      }
    }
  }
`;
