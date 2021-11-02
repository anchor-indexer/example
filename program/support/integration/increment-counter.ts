import utils from './utils';

main();

async function main() {
  const { program, userAccount, counterAccount } = await utils();

  await program.rpc.increment({
    accounts: {
      counter: counterAccount,
      authority: userAccount,
    },
  });
}
