import { FC, ReactNode, createContext, useContext } from 'react';
import { Connection } from '@solana/web3.js';
import { useConnection as useBaseConnection } from '@solana/wallet-adapter-react';

import { useConnectionWalletAdapter } from './connection-wallet-adapter';

const ConnectionContext = createContext<{
  connection: Connection;
} | null>(null);

export const ConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { connection } = useBaseConnection();

  return (
    <ConnectionContext.Provider
      value={{
        connection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('Missing Connection context');
  }
  return context.connection;
}

export function useConnectionConfig() {
  const { endpoint, config } = useConnectionWalletAdapter();
  return {
    endpoint,
    config,
  };
}
