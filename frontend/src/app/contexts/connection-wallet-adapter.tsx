import React, { FC, ReactNode } from 'react';
import * as anchor from '@project-serum/anchor';
import { ConnectionProvider as BaseConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletProvider as BaseWalletProvider } from '@solana/wallet-adapter-react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

import { DEVNET_SOLANA_RPC_URL, DEVNET_SOLANA_WS_URL } from '@app/config';
console.log({ DEVNET_SOLANA_RPC_URL, DEVNET_SOLANA_WS_URL });
const CONFIG: anchor.web3.ConnectionConfig = {
  commitment: 'confirmed' as anchor.web3.Commitment,
  wsEndpoint: DEVNET_SOLANA_WS_URL,
  confirmTransactionInitialTimeout: 90 * 1000,
};

const WALLETS = [new PhantomWalletAdapter()];

export const ConnectionWalletAdapterProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const onError = () => {};
  return (
    <BaseConnectionProvider endpoint={DEVNET_SOLANA_RPC_URL} config={CONFIG}>
      <BaseWalletProvider wallets={WALLETS} {...{ onError }} autoConnect>
        <WalletDialogProvider>{children}</WalletDialogProvider>
      </BaseWalletProvider>
    </BaseConnectionProvider>
  );
};
