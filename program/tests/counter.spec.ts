import assert from 'assert';
import * as anchor from '@project-serum/anchor';

describe('counter', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;
  const userAccount = provider.wallet.publicKey;

  it('Initializes count', async () => {
    const [counterAccount, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          userAccount.toBuffer(),
        ],
        program.programId
      );

    await program.rpc.initialize(bump, {
      accounts: {
        counter: counterAccount,
        authority: userAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });

    const counterInfo = await program.account.counter.fetch(counterAccount);
    assert.ok(counterInfo.count.eq(new anchor.BN(0)));
  });

  it('Increments count', async () => {
    const [counterAccount, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          userAccount.toBuffer(),
        ],
        program.programId
      );

    await program.rpc.increment({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });

    const counter = await program.account.counter.fetch(counterAccount);
    assert.ok(counter.count.eq(new anchor.BN(1)));
  });

  it('Decrements count', async () => {
    const [counterAccount, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          userAccount.toBuffer(),
        ],
        program.programId
      );

    await program.rpc.decrement({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });

    const counter = await program.account.counter.fetch(counterAccount);
    assert.ok(counter.count.eq(new anchor.BN(0)));
  });

  it('Resets count', async () => {
    const [counterAccount, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('counter_v1')),
          userAccount.toBuffer(),
        ],
        program.programId
      );

    await program.rpc.increment({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });
    assert.ok(
      (await program.account.counter.fetch(counterAccount)).count.eq(
        new anchor.BN(1)
      )
    );

    await program.rpc.increment({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });
    assert.ok(
      (await program.account.counter.fetch(counterAccount)).count.eq(
        new anchor.BN(2)
      )
    );

    await program.rpc.reset({
      accounts: {
        counter: counterAccount,
        authority: userAccount,
      },
    });

    assert.ok(
      (await program.account.counter.fetch(counterAccount)).count.eq(
        new anchor.BN(0)
      )
    );
  });
});
