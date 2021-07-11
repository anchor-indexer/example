import assert from 'assert';
import * as anchor from '@project-serum/anchor';

describe('counter', () => {
  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;
  const userPubKey = provider.wallet.publicKey;

  it('Initializes count', async () => {
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
  });

  it('Increments count', async () => {
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );

    await program.rpc.increment({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });

    const counter = await program.account.counter.associated(userPubKey);
    assert.ok(counter.count.eq(new anchor.BN(1)));
  });

  it('Decrements count', async () => {
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );

    await program.rpc.decrement({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });

    const counter = await program.account.counter.associated(userPubKey);
    assert.ok(counter.count.eq(new anchor.BN(0)));
  });

  it('Resets count', async () => {
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );

    await program.rpc.increment({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });
    assert.ok(
      (await program.account.counter.associated(userPubKey)).count.eq(
        new anchor.BN(1)
      )
    );

    await program.rpc.increment({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });
    assert.ok(
      (await program.account.counter.associated(userPubKey)).count.eq(
        new anchor.BN(2)
      )
    );

    await program.rpc.reset({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });

    assert.ok(
      (await program.account.counter.associated(userPubKey)).count.eq(
        new anchor.BN(0)
      )
    );
  });
});
