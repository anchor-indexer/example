import React, { FC, useContext, createContext, ReactNode } from 'react';
import * as anchor from '@project-serum/anchor';

import useProgram from '@app/hooks/useProgram';
import COUNTER_PROGRAM_IDL from '@app/idls/counter.json';
import { COUNTER_PROGRAM_ID } from '@app/config';

const ProgramsContext = createContext<{
  counterProgram: anchor.Program | null;
} | null>(null);

export const ProgramsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const counterProgram = useProgram(
    COUNTER_PROGRAM_ID,
    COUNTER_PROGRAM_IDL as anchor.Idl
  );

  return (
    <ProgramsContext.Provider
      value={{
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
    throw new Error('Missing Programs context');
  }
  return context;
}
