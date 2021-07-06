import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import utils from './utils';

main();

async function main() {
  const { program, userPubKey } = utils();

  const counterPubKey = await program.account.counter.associatedAddress(
    userPubKey
  );

  await program.rpc.initialize({
    accounts: {
      counter: counterPubKey,
      authority: userPubKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const counter = await program.account.counter.associated(userPubKey);
  assert.ok(counter.count.eq(new anchor.BN(0)));
}
