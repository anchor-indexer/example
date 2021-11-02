import * as anchor from '@project-serum/anchor';

export default async function () {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;
  const userAccount = provider.wallet.publicKey;

  const [counterAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
      userAccount.toBuffer(),
    ],
    program.programId
  );

  return { program, userAccount, counterAccount, bump };
}
