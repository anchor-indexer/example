import React, { FC, ReactNode, createContext, useContext } from 'react';
import * as anchor from '@project-serum/anchor';
import { useConnection as useBaseConnection } from '@solana/wallet-adapter-react';

const ConnectionContext = createContext<{
  connection: anchor.web3.Connection;
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
