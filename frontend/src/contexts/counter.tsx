import {
  FC,
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useQuery, gql } from '@apollo/client';
import * as anchor from '@project-serum/anchor';
import noop from 'lodash/noop';
import Wallet from '@project-serum/sol-wallet-adapter';

import { useProgram } from 'contexts/program';
import { useWallet } from 'contexts/wallet';
import * as apollo from 'utils/apollo';

const ACCOUNT_QUERY = `
  count
`;

export const COUNTER_QUERY = gql`
  query($authority: String!) {
    counter(authority: $authority) {
      ${ACCOUNT_QUERY}
    }
  }
`;

export const COUNTER_SUBSCRIPTION = gql`
  subscription($authority: String!) {
    counterChanged(authority: $authority) {
      ${ACCOUNT_QUERY}
    }
  }
`;

const CounterContext = createContext<{
  count: number;
  counterAccount: anchor.web3.PublicKey | null;
  incrementCount: () => void;
  decrementCount: () => void;
  resetCount: () => void;
} | null>(null);

export const CounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connected, wallet } = useWallet();
  const { provider: providerOrNull, program } = useProgram();

  const userAccount = wallet?.publicKey;
  const provider = providerOrNull!;

  const [
    counterAccount,
    setCounterAccount,
  ] = useState<anchor.web3.PublicKey | null>(null);
  const [counterBump, setCounterBump] = useState<number | null>(null);

  // load counterAccount and counterBump
  useEffect(() => {
    if (!(userAccount && program)) return;

    const load = async () => {
      const [
        _counterAccount,
        _counterBump,
      ] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          userAccount.toBuffer(),
        ],
        program.programId
      );
      setCounterAccount(_counterAccount);
      setCounterBump(_counterBump);
    };

    load();
  }, [userAccount, program]);

  return !(
    userAccount &&
    counterAccount &&
    counterBump !== null &&
    program &&
    provider
  ) ? (
    <CounterContext.Provider
      value={{
        count: 0,
        counterAccount: null,
        incrementCount: noop,
        decrementCount: noop,
        resetCount: noop,
      }}
    >
      {children}
    </CounterContext.Provider>
  ) : (
    <Load
      {...{
        connected,
        userAccount: userAccount!,
        counterAccount: counterAccount!,
        counterBump: counterBump!,
        provider,
        program,
        wallet,
      }}
    >
      {children}
    </Load>
  );
};

const Load: FC<{
  children: ReactNode;
  connected: Boolean;
  userAccount: anchor.web3.PublicKey;
  counterAccount: anchor.web3.PublicKey;
  counterBump: number;
  provider: anchor.Provider;
  program: anchor.Program;
  wallet: typeof Wallet;
}> = ({
  children,
  connected,
  userAccount,
  counterAccount,
  counterBump,
  provider,
  program,
  wallet,
}) => {
  const { connect } = useWallet();

  const {
    subscribeToMore: subscribeToMoreAccountsData,
    data: counterData,
    // loading: isLoadingCounter,
  } = useQuery(COUNTER_QUERY, {
    variables: { authority: userAccount.toString() },
    client: apollo.client,
  });

  useEffect(() => {
    const unsub = subscribeToMoreAccountsData({
      document: COUNTER_SUBSCRIPTION,
      variables: { authority: userAccount.toString() },
      updateQuery: (prev, { subscriptionData }) => {
        const count =
          subscriptionData?.data?.counterChanged?.count ??
          prev?.counter?.count ??
          0;

        return { counter: { count } };
      },
    });

    return unsub;
  }, [subscribeToMoreAccountsData, userAccount]);

  // useEffect(() => {
  //   if (!(program && counterAccount)) return;

  //   let isMounted = true;
  //   const unsubs = [
  //     () => {
  //       isMounted = false;
  //     },
  //   ];

  //   if (connected) {
  //     const loadCount = async () => {
  //       try {
  //         const {
  //           data: { counter },
  //         } = await apollo.client.query({
  //           query: apollo.gql`
  //             query($authority: String!) {
  //               counter(authority: $authority) {
  //                 count
  //               }
  //             }
  //           `,
  //           variables: {
  //             authority: userAccount.toString(),
  //           },
  //         });
  //         if (isMounted) {
  //           setCount(counter?.count ?? 0);
  //         }
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };

  //     // const subscribeToCountChange = async () => {
  //     //   const sid = connection.onAccountChange(counterAccount, loadCount);
  //     //   unsubs.push(() => {
  //     //     connection.removeAccountChangeListener(sid);
  //     //   });
  //     // };

  //     loadCount();
  //     // subscribeToCountChange();
  //   }

  //   return () => unsubs.forEach((unsub) => unsub());
  // }, [connected, userAccount, counterAccount, program, connection]);

  const initializeCounter = useCallback(async () => {
    if (!(program && provider)) return;

    await program.rpc.initialize(counterBump!, {
      accounts: {
        counter: counterAccount,
        authority: userAccount,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
  }, [program, provider, userAccount, counterAccount, counterBump]);

  const incrementCount = useCallback(async () => {
    if (!(program && provider && counterAccount)) return;
    if (!connected) return connect();

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }

    await program.rpc.increment({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });
  }, [
    connected,
    userAccount,
    counterAccount,
    initializeCounter,
    program,
    provider,
    connect,
  ]);

  const decrementCount = useCallback(async () => {
    if (!(program && provider && counterAccount)) return;
    if (!connected) return connect();

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }

    await program.rpc.decrement({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });
  }, [
    connected,
    userAccount,
    counterAccount,
    initializeCounter,
    program,
    provider,
    connect,
  ]);

  const resetCount = useCallback(async () => {
    if (!(program && provider && counterAccount)) return;
    if (!connected) return connect();

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }

    await program.rpc.reset({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });
  }, [
    connected,
    userAccount,
    counterAccount,
    initializeCounter,
    program,
    provider,
    connect,
  ]);

  return (
    <CounterContext.Provider
      value={{
        count: counterData?.counter?.count ?? 0,
        counterAccount,
        incrementCount,
        decrementCount,
        resetCount,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('Missing counter context');
  }
  const {
    count,
    counterAccount,
    incrementCount,
    decrementCount,
    resetCount,
  } = context;

  return {
    count,
    counterAccount,
    incrementCount,
    decrementCount,
    resetCount,
  };
}
