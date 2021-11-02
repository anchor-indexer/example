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

import PROGRAM_IDL from 'idl/counter.json';

import { useConnection, useConnectionConfig } from './connection';
import { useWallet } from './wallet';

const ProgramContext = createContext<{
  provider: anchor.Provider | null;
  program: anchor.Program | null;
} | null>(null);

export const ProgramProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [program, setProgram] = useState<anchor.Program | null>(null);
  const connection = useConnection();
  const { wallet } = useWallet();
  const { config } = useConnectionConfig();

  const provider = useMemo(
    () =>
      !(connection && wallet)
        ? null
        : new anchor.Provider(connection, wallet, {}),
    [connection, wallet]
  );

  const programId = config.programId;

  useEffect(() => {
    if (!(provider && programId)) return;

    anchor.setProvider(provider);

    const program = new anchor.Program(PROGRAM_IDL as anchor.Idl, programId);
    setProgram(program);
  }, [provider, programId]);

  return (
    <ProgramContext.Provider
      value={{
        provider,
        program,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('Missing Program context');
  }
  const { provider, program } = context;
  return {
    provider,
    program,
  };
}
