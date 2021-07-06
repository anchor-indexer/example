import * as anchor from '@project-serum/anchor';

export default function () {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;
  const userPubKey = provider.wallet.publicKey;

  return { program, userPubKey };
}
