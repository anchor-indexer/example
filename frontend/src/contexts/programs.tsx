import {
  FC,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as anchor from '@project-serum/anchor';

import COUNTER_PROGRAM_IDL from 'idl/counter.json';
import { useConnection } from './connection';
import { useWallet } from './wallet';

const ProgramsContext = createContext<{
  provider: anchor.Provider | null;
  counterProgram: anchor.Program | null;
} | null>(null);

export const ProgramsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [counterProgram, setCounterProgram] = useState<anchor.Program | null>(
    null
  );

  const connection = useConnection();
  const { wallet } = useWallet();
  const provider = useMemo(
    () =>
      !(connection && wallet)
        ? null
        : new anchor.Provider(connection, wallet, {}),
    [connection, wallet]
  );

  useEffect(() => {
    if (provider) {
      anchor.setProvider(provider);

      const programId = '5KtpkTJvEn5LBWJjt5LeFBnCYYxqUJgQgE8h4q6PqN9M';
      const counterProgram = new anchor.Program(
        COUNTER_PROGRAM_IDL as anchor.Idl,
        programId
      );
      setCounterProgram(counterProgram);
    }
  }, [provider]);

  return (
    <ProgramsContext.Provider
      value={{
        provider,
        counterProgram,
      }}
    >
      {children}
    </ProgramsContext.Provider>
  );
};

export function usePrograms() {
  const context = useContext(ProgramsContext);
  if (!context) {
    throw new Error('Missing programs context');
  }
  const { provider, counterProgram } = context;

  return { provider, counterProgram };
}
