import utils from './utils';

main().catch(console.error);

async function main() {
  const { program, userAccount, counterAccount } = await utils();

  await program.rpc.decrement({
    accounts: {
      counter: counterAccount,
      authority: userAccount,
    },
  });

  // const counterInfo = await program.account.counter.fetch(counterAccount);
  // assert.ok(counterInfo.count.eq(new anchor.BN(0)));
  console.log('done');
}
