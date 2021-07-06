import utils from './utils';

main();

async function main() {
  const { program, userPubKey } = utils();

  const counterPubKey = await program.account.counter.associatedAddress(
    userPubKey
  );

  await program.rpc.increment({
    accounts: {
      counter: counterPubKey,
      authority: userPubKey,
    },
  });
}
