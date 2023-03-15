import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import * as anchor from '@project-serum/anchor';
import {
  useAnchorWallet,
  useWallet as useBaseWallet,
} from '@solana/wallet-adapter-react';
import { useWalletDialog } from '@solana/wallet-adapter-material-ui';

const WalletContext = createContext<{
  publicKey: anchor.web3.PublicKey | null;
  signMessage: (msg: Uint8Array) => Promise<Uint8Array | null>;
  signTransaction: (
    tx: anchor.web3.Transaction
  ) => Promise<anchor.web3.Transaction | null>;
  connect: () => void;
  disconnect: () => void;
} | null>(null);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const { signMessage: baseSignMessage } = useBaseWallet();
  const { setOpen: setWalletDialogOpen } = useWalletDialog();

  const signMessage = useCallback(
    async (msg: Uint8Array) => {
      return (await baseSignMessage?.(msg)) ?? null;
    },
    [baseSignMessage]
  );

  const signTransaction = useCallback(
    async (
      tx: anchor.web3.Transaction
    ): Promise<anchor.web3.Transaction | null> => {
      return (await wallet?.signTransaction(tx)) ?? null;
    },
    [wallet]
  );

  const connect = () => {
    setWalletDialogOpen(true);
  };

  const disconnect = () => {};

  const publicKey = useMemo(() => wallet?.publicKey ?? null, [
    wallet,
    // wallet?.publicKey?.toString(), // todo: check perf
  ]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        signMessage,
        signTransaction,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing Wallet context');
  }
  return context;
}
