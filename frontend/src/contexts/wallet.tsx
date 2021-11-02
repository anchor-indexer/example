import { FC, ReactNode, createContext, useContext } from 'react';
import * as anchor from '@project-serum/anchor';
import {
  AnchorWallet,
  useAnchorWallet,
  useWallet as useBaseWallet,
} from '@solana/wallet-adapter-react';
import { useWalletDialog } from '@solana/wallet-adapter-material-ui';
import { Transaction, Keypair } from '@solana/web3.js';

const WalletContext = createContext<{
  wallet: AnchorWallet | null;
  connected: boolean;
  publicKey: anchor.web3.PublicKey | null;
  connect: () => void;
} | null>(null);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connected, publicKey } = useBaseWallet();
  const wallet = useAnchorWallet();
  const { setOpen } = useWalletDialog();

  return (
    <WalletContext.Provider
      value={{
        wallet: wallet ?? createDummyWallet(), // fallback to dummy wallet in order to have provider available in stats
        connected,
        publicKey,
        connect: () => {
          setOpen(true);
        },
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
  const { wallet, connected, publicKey, connect } = context;
  return {
    wallet,
    connected,
    publicKey: publicKey!,
    connect,
  };
}

function createDummyWallet() {
  return {
    signTransaction: async (tx: Transaction) => tx,
    signAllTransactions: async (txs: Transaction[]) => txs,
    publicKey: Keypair.generate().publicKey,
  };
}
