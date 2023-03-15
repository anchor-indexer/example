import { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';

import { useProvider } from '@app/contexts/provider';

function useProgram(programId: anchor.web3.PublicKey, idl: anchor.Idl) {
  const [program, setProgram] = useState<anchor.Program | null>(null);
  const provider = useProvider();

  useEffect(() => {
    if (!provider) return;

    async function load() {
      const program = new anchor.Program(
        idl as anchor.Idl,
        programId,
        provider!
      );

      setProgram(program);
    }

    load();
  }, [provider, programId, idl]);

  return program;
}

export default useProgram;
