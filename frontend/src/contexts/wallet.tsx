import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';

import notify from 'components/shared/TxNotification';
import { useConnectionConfig } from './connection';
import { useLocalStorageState } from 'utils/solana';

export const WALLET_PROVIDERS = [
  { name: 'sollet.io', url: 'https://www.sollet.io' },
];

const WalletContext = createContext<{
  wallet: any;
  connected: any;
  providerUrl: any;
  setProviderUrl: any;
  providerName: any;
} | null>(null);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { endpoint } = useConnectionConfig();

  const [savedProviderUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    'https://www.sollet.io'
  );
  const providerUrl = !savedProviderUrl
    ? 'https://www.sollet.io'
    : savedProviderUrl;

  const wallet = useMemo(() => new Wallet(providerUrl, endpoint), [
    providerUrl,
    endpoint,
  ]);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log('trying to connect');
    wallet.on('connect', () => {
      console.log('connected');
      setConnected(true);
      let walletPublicKey = wallet.publicKey.toBase58();
      let keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length
            )}`
          : walletPublicKey;
      notify({
        message: 'Wallet update',
        description: 'Connected to wallet ' + keyToDisplay,
      });
    });
    wallet.on('disconnect', () => {
      setConnected(false);
      notify({
        message: 'Wallet update',
        description: 'Disconnected from wallet',
      });
    });
    return () => {
      wallet.disconnect();
      setConnected(false);
    };
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        providerUrl,
        setProviderUrl,
        providerName:
          WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
          providerUrl,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }
  return {
    connected: context.connected,
    wallet: context.wallet,
    providerUrl: context.providerUrl,
    setProvider: context.setProviderUrl,
    providerName: context.providerName,
  };
}
