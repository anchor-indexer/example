import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  Account,
  Connection,
  // AccountInfo, PublicKey
} from '@solana/web3.js';
// import * as anchor from '@project-serum/anchor';
// import tuple from 'immutable-tuple';
// import { setCache, useAsyncData } from 'utils/fetch-loop';
import { useLocalStorageState } from 'utils/solana';
import { ENDPOINTS, ENDPOINT } from 'config';

// const accountListenerCount = new Map();

const ConnectionContext = createContext<{
  endpoint: any;
  setEndpoint: any;
  connection: any;
  sendConnection: any;
  availableEndpoints: any;
  setCustomEndpoints: any;
} | null>(null);

export const ConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'connectionEndpts',
    ENDPOINT.endpoint
  );
  const [customEndpoints, setCustomEndpoints] = useLocalStorageState(
    'customConnectionEndpoints',
    []
  );
  const availableEndpoints = ENDPOINTS.concat(customEndpoints);

  const connection = useMemo(() => new Connection(endpoint, 'recent'), [
    endpoint,
  ]);
  const sendConnection = useMemo(() => new Connection(endpoint, 'recent'), [
    endpoint,
  ]);

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {});
    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = connection.onSlotChange(() => null);
    return () => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = sendConnection.onAccountChange(
      new Account().publicKey,
      () => {}
    );
    return () => {
      sendConnection.removeAccountChangeListener(id);
    };
  }, [sendConnection]);

  useEffect(() => {
    const id = sendConnection.onSlotChange(() => null);
    return () => {
      sendConnection.removeSlotChangeListener(id);
    };
  }, [sendConnection]);

  return (
    <ConnectionContext.Provider
      value={{
        endpoint,
        setEndpoint,
        connection,
        sendConnection,
        availableEndpoints,
        setCustomEndpoints,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('Missing connection context');
  }
  return context.connection;
}

export function useSendConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('Missing connection context');
  }
  return context.sendConnection;
}

export function useConnectionConfig() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('Missing connection context');
  }
  return {
    endpoint: context.endpoint,
    endpointInfo: context.availableEndpoints.find(
      (info: any) => info.endpoint === context.endpoint
    ),
    setEndpoint: context.setEndpoint,
    availableEndpoints: context.availableEndpoints,
    setCustomEndpoints: context.setCustomEndpoints,
  };
}

// export function useAccountInfo(publicKey: PublicKey) {
//   const connection = useConnection();
//   const cacheKey = tuple(connection, publicKey?.toBase58());
//   const [accountInfo, loaded] = useAsyncData(
//     async () => (publicKey ? connection.getAccountInfo(publicKey) : null),
//     cacheKey,
//     { refreshInterval: 60_000 }
//   );
//   useEffect(() => {
//     if (!publicKey) {
//       return;
//     }
//     if (accountListenerCount.has(cacheKey)) {
//       let currentItem = accountListenerCount.get(cacheKey);
//       ++currentItem.count;
//     } else {
//       let previousData: any = null;
//       const subscriptionId = connection.onAccountChange(publicKey, (e: any) => {
//         if (e.data) {
//           if (!previousData || !previousData.equals(e.data)) {
//             setCache(cacheKey, e);
//           } else {
//           }
//           previousData = e.data;
//         }
//       });
//       accountListenerCount.set(cacheKey, { count: 1, subscriptionId });
//     }
//     return () => {
//       let currentItem = accountListenerCount.get(cacheKey);
//       let nextCount = currentItem.count - 1;
//       if (nextCount <= 0) {
//         connection.removeAccountChangeListener(currentItem.subscriptionId);
//         accountListenerCount.delete(cacheKey);
//       } else {
//         --currentItem.count;
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cacheKey]);
//   return [accountInfo, loaded];
// }

// export function useAccountData(publicKey: PublicKey) {
//   const [accountInfo] = useAccountInfo(publicKey);
//   return accountInfo && accountInfo.data;
// }

// export function setInitialAccountInfo(
//   connection: Connection,
//   publicKey: PublicKey,
//   accountInfo: AccountInfo<any>
// ) {
//   const cacheKey = tuple(connection, publicKey.toBase58());
//   setCache(cacheKey, accountInfo, { initializeOnly: true });
// }
