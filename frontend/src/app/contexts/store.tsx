import React, { FC, ReactNode, createContext, useContext } from 'react';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import { useConnection } from '@app/contexts/connection';
import { useWallet } from '@app/contexts/wallet';
import { toBigNumber } from '@app/utils/bn';

const StoreContext = createContext<{
  solBalance: BigNumber;
} | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const solBalance = useSOLBalance();

  return (
    <StoreContext.Provider
      value={{
        solBalance,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('Missing Store context');
  }
  return context;
}

function useSOLBalance() {
  const connection = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<BigNumber>(toBigNumber(0));

  useEffect(() => {
    if (!(connection && publicKey)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const loadBalance = async () => {
      const balance = await connection.getBalance(publicKey);
      if (isMounted) {
        setBalance(new BigNumber(balance.toString()));
      }
    };

    loadBalance();

    const sid = connection.onAccountChange(publicKey, loadBalance);
    unsubs.push(() => {
      connection.removeAccountChangeListener(sid);
    });

    return () => unsubs.forEach((unsub) => unsub());
  }, [connection, publicKey]);

  return balance;
}
