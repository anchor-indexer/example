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
import {
  // useConnection,
  useConnectionConfig,
  // useAccountInfo,
  // setInitialAccountInfo,
} from './connection';
import { useLocalStorageState } from 'utils/solana';
// import { useAsyncData } from 'utils/fetch-loop';
// import { getOwnedTokenAccounts } from 'hooks/tokens';
// import { useTokenName } from 'hooks/tokens/names';
// import { parseMintData, parseTokenAccountData } from 'hooks/tokens/data';
// import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from 'hooks/tokens/instructions';
// import { Account, AccountInfo, Connection, PublicKey } from '@solana/web3.js';

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

// function getTokenAccountInfo(connection: Connection, publicKey: PublicKey) {
//   return async function () {
//     let accounts = await getOwnedTokenAccounts(connection, publicKey);
//     return accounts.map(
//       ({
//         publicKey,
//         accountInfo,
//       }: {
//         publicKey: PublicKey;
//         accountInfo: AccountInfo<any>;
//       }) => {
//         setInitialAccountInfo(connection, publicKey, accountInfo);
//         return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
//       }
//     );
//   };
// }

// export function useWalletPublicKeys() {
//   const { wallet } = useWallet();
//   const connection = useConnection();
//   const fn = getTokenAccountInfo(connection, wallet.publicKey);
//   const [tokenAccountInfo, loaded] = useAsyncData(fn, fn);
//   const getPublicKeys = () => [
//     wallet.publicKey,
//     ...(tokenAccountInfo
//       ? tokenAccountInfo.map(
//           ({ publicKey }: { publicKey: PublicKey }) => publicKey
//         )
//       : []),
//   ];
//   const serialized = getPublicKeys()
//     .map((pubKey) => pubKey?.toBase58() || '')
//     .toString();

//   // Prevent users from re-rendering unless the list of public keys actually changes
//   let publicKeys = useMemo(getPublicKeys, [
//     serialized,
//     tokenAccountInfo,
//     wallet.publicKey,
//   ]);
//   return [publicKeys, loaded];
// }

// export function useBalanceInfo(publicKey: PublicKey) {
//   let [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey);
//   let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
//     ? parseTokenAccountData(accountInfo.data)
//     : {};
//   let [mintInfo, mintInfoLoaded] = useAccountInfo(mint);
//   let { name, symbol } = useTokenName(mint);

//   if (!accountInfoLoaded) {
//     return null;
//   }

//   if (mint && mint.equals(WRAPPED_SOL_MINT)) {
//     return {
//       amount,
//       decimals: 9,
//       mint,
//       owner,
//       tokenName: 'Wrapped SOL',
//       tokenSymbol: 'SOL',
//       valid: true,
//     };
//   }

//   if (mint && mintInfoLoaded) {
//     try {
//       let { decimals } = parseMintData(mintInfo.data);
//       return {
//         amount,
//         decimals,
//         mint,
//         owner,
//         tokenName: name,
//         tokenSymbol: symbol,
//         valid: true,
//       };
//     } catch (e) {
//       return {
//         amount,
//         decimals: 0,
//         mint,
//         owner,
//         tokenName: 'Invalid',
//         tokenSymbol: 'INVALID',
//         valid: false,
//       };
//     }
//   }

//   if (!mint) {
//     return {
//       amount: accountInfo?.lamports ?? 0,
//       decimals: 9,
//       mint: null,
//       owner: publicKey,
//       tokenName: 'SOL',
//       tokenSymbol: 'SOL',
//       valid: true,
//     };
//   }

//   return null;
// }
