import React, {
  FC,
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import * as anchor from '@project-serum/anchor';
import { useLocation } from 'react-router-dom';

import { usePrograms } from '@app/contexts/programs';
import { useWallet } from '@app/contexts/wallet';
import { useRequest } from '@app/hooks/useRequest';

import { useTx } from './tx';

type Counter = {
  count: number;
};

const CounterContext = createContext<{
  count: number;
  counterAccount: anchor.web3.PublicKey | null;
  incrementCount: () => void;
  decrementCount: () => void;
  resetCount: () => void;
} | null>(null);

export const CounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connect } = useWallet();
  const { counterProgram: program } = usePrograms();
  const tx = useTx();
  const { search } = useLocation();

  const [
    counterAccount,
    setCounterAccount,
  ] = useState<anchor.web3.PublicKey | null>(null);
  const [counterBump, setCounterBump] = useState<number | null>(null);

  // load counterAccount and counterBump
  useEffect(() => {
    if (!(publicKey && program)) return;

    const load = async () => {
      const [
        _counterAccount,
        _counterBump,
      ] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          publicKey.toBuffer(),
        ],
        program.programId
      );
      setCounterAccount(_counterAccount);
      setCounterBump(_counterBump);
    };

    load();
  }, [publicKey, program]);

  const query = useMemo(
    () =>
      !publicKey
        ? null
        : `
  query {
    Counter(
        where: {
          authority: {
            eq: "${publicKey.toBase58()}"
          }
        }
    ) {
      count
    }
  }
`,
    [publicKey]
  );
  const pending = useMemo(
    () => new URLSearchParams(search).get('pending') === 'true',
    [search]
  );
  const countersRequest = useRequest<{ Counter: Counter[] }>(
    import.meta.env.VITE_SUBGRAPH_NAME,
    pending,
    query,
    true
  );

  const initializeCounter = useCallback(async () => {
    if (!publicKey) return connect();
    if (!(program && counterBump && counterAccount)) return;

    await tx.send(async () => {
      return {
        ixs: [
          program.instruction.initialize(counterBump, {
            accounts: {
              counter: counterAccount,
              authority: publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            },
          }),
        ],
      };
    });
  }, [program, publicKey, counterAccount, counterBump, tx, connect]);

  const incrementCount = useCallback(async () => {
    if (!publicKey) return connect();
    if (!(program && counterBump && counterAccount)) return;

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {
      console.error(e);
    }
    if (!counter) {
      await initializeCounter();
    }

    await tx.send(async () => {
      return {
        ixs: [
          program.instruction.increment({
            accounts: {
              counter: counterAccount,
              authority: publicKey,
            },
          }),
        ],
      };
    });
  }, [
    program,
    publicKey,
    counterAccount,
    counterBump,
    tx,
    connect,
    initializeCounter,
  ]);

  const decrementCount = useCallback(async () => {
    if (!publicKey) return connect();
    if (!(program && counterBump && counterAccount)) return;

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {
      console.error(e);
    }
    if (!counter) {
      await initializeCounter();
    }

    await tx.send(async () => {
      return {
        ixs: [
          program.instruction.decrement({
            accounts: {
              counter: counterAccount,
              authority: publicKey,
            },
          }),
        ],
      };
    });
  }, [
    program,
    publicKey,
    counterAccount,
    counterBump,
    tx,
    connect,
    initializeCounter,
  ]);

  const resetCount = useCallback(async () => {
    if (!publicKey) return connect();
    if (!(program && counterBump && counterAccount)) return;

    let counter;
    try {
      counter = await program.account.counter.fetch(counterAccount);
    } catch (e) {
      console.error(e);
    }
    if (!counter) {
      await initializeCounter();
    }

    await tx.send(async () => {
      return {
        ixs: [
          program.instruction.reset({
            accounts: {
              counter: counterAccount,
              authority: publicKey,
            },
          }),
        ],
      };
    });
  }, [
    program,
    publicKey,
    counterAccount,
    counterBump,
    tx,
    connect,
    initializeCounter,
  ]);

  return (
    <CounterContext.Provider
      value={{
        count: countersRequest.result?.Counter[0]?.count ?? 0,
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
