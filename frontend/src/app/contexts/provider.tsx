import React, {
  FC,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import * as anchor from '@project-serum/anchor';

import { useConnection } from './connection';
import { useWallet } from './wallet';

const AnchorProviderContext = createContext<{
  provider: anchor.AnchorProvider | null;
} | null>(null);

export const AnchorProviderProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const connection = useConnection();
  const { wallet } = useWallet();

  const provider = useMemo(
    () =>
      !connection
        ? null
        : new anchor.AnchorProvider(connection, wallet, {
            commitment: 'confirmed',
          }),
    [connection, wallet]
  );

  useEffect(() => {
    if (!provider) return;
    anchor.setProvider(provider);
  }, [provider]);

  return (
    <AnchorProviderContext.Provider
      value={{
        provider,
      }}
    >
      {children}
    </AnchorProviderContext.Provider>
  );
};

export function useProvider() {
  const context = useContext(AnchorProviderContext);
  if (!context) {
    throw new Error('Missing Provider context');
  }
  return context.provider;
}
