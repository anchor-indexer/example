import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Account, Connection } from '@solana/web3.js';
import { useLocalStorageState } from 'utils/solana';
import { ENDPOINTS, ENDPOINT } from 'config';

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
