import * as anchor from '@project-serum/anchor';
import * as fs from 'fs';
import * as path from 'path';

export default async function () {
  const provider = anchor.AnchorProvider.local(process.env.SOLANA_RPC_URL);
  anchor.setProvider(provider);

  const program = getProgram();
  const userAccount = provider.wallet.publicKey;

  const [counterAccount, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
      userAccount.toBuffer(),
    ],
    program.programId
  );

  return { program, userAccount, counterAccount, bump };
}

function getProgram() {
  // return anchor.workspace.counter;
  const idl = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../target/idl/counter.json'),
      'utf-8'
    )
  );
  return new anchor.Program(idl, idl.metadata.address);
}
