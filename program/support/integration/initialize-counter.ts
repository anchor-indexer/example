import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import utils from './utils';

main().catch(console.error);

async function main() {
  const { program, userAccount, counterAccount, bump } = await utils();

  await program.rpc.initialize(bump, {
    accounts: {
      counter: counterAccount,
      authority: userAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const counterInfo = await program.account.counter.fetch(counterAccount);
  assert.ok(counterInfo.count.eq(new anchor.BN(0)));
}
