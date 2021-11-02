import {
  FC,
  ReactNode,
  createContext,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
  // ENDPOINTS,
  ENDPOINT,
} from 'config';
import { ConnectionProvider as BaseConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletProvider as BaseWalletProvider } from '@solana/wallet-adapter-react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';

import {
  // getLedgerWallet,
  getPhantomWallet,
  // getSlopeWallet,
  // getSolflareWallet,
  getSolletWallet,
  // getSolletExtensionWallet,
  // getTorusWallet,
} from '@solana/wallet-adapter-wallets';

const ConnectionWalletAdapterContext = createContext<{
  endpoint: string;
  config: any;
} | null>(null);

export const ConnectionWalletAdapterProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const network = WalletAdapterNetwork.Devnet;
  const { endpoint, config } = ENDPOINT;

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      // getSlopeWallet(),
      // getSolflareWallet(),
      // getTorusWallet({
      //   options: { clientId: 'Get a client ID @ https://developer.tor.us' },
      // }),
      // getLedgerWallet(),
      getSolletWallet({ network }),
      // getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  // const onError = useCallback(
  //   (error: WalletError) => {
  //     enqueueSnackbar(
  //       error.message ? `${error.name}: ${error.message}` : error.name,
  //       { variant: 'error' }
  //     );
  //     console.error(error);
  //   },
  //   [enqueueSnackbar]
  // );

  return (
    <ConnectionWalletAdapterContext.Provider
      value={{
        endpoint,
        config,
      }}
    >
      <BaseConnectionProvider {...{ endpoint }}>
        <BaseWalletProvider {...{ wallets, onError }} autoConnect>
          <WalletDialogProvider>{children}</WalletDialogProvider>
        </BaseWalletProvider>
      </BaseConnectionProvider>
    </ConnectionWalletAdapterContext.Provider>
  );
};

export function useConnectionWalletAdapter() {
  const context = useContext(ConnectionWalletAdapterContext);
  if (!context) {
    throw new Error('Missing ConnectionWalletAdapter context');
  }
  return context;
}
