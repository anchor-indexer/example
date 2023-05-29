import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';

import { useProvider } from '@app/contexts/provider';

function useProgram(programId: anchor.web3.PublicKey, idl: anchor.Idl) {
  const provider = useProvider();

  const program = useMemo(
    () =>
      !provider
        ? null
        : new anchor.Program(idl as anchor.Idl, programId, provider!),
    [provider, programId, idl]
  );

  return program;
}

export default useProgram;
