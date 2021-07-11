import { FC, useCallback, useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import IncrementCountIcon from '@material-ui/icons/Add';
import DecrementCountIcon from '@material-ui/icons/Remove';
import * as anchor from '@project-serum/anchor';

import { useWallet } from 'contexts/wallet';
import { usePrograms } from 'contexts/programs';
import { useConnection } from 'contexts/connection';
// import * as apollo from 'utils/apollo';

const useStyles = makeStyles(() => {
  return {
    container: {
      width: 400,
      margin: '0 auto',
    },
  };
});

const Home: FC = () => {
  const classes = useStyles();
  const connection = useConnection();
  const { connected, wallet } = useWallet();
  const { provider: providerOrNull, counterProgram } = usePrograms();
  const [count, setCount] = useState(0);

  const userPubKey = wallet.publicKey;

  const provider = providerOrNull!;
  const program = counterProgram!;

  useEffect(() => {
    if (!program) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    if (connected) {
      const loadCount = async () => {
        try {
          // const {
          //   data: { counter },
          // } = await apollo.client.query({
          //   query: apollo.gql`
          //     query($authority: String!) {
          //       counter(authority: $authority) {
          //         count
          //       }
          //     }
          //   `,
          //   variables: {
          //     authority: userPubKey.toString(),
          //   },
          // });
          // if (isMounted) {
          //   setCount(counter?.count ?? 0);
          // }

          const counter = await program.account.counter.associated(userPubKey);
          if (isMounted) {
            setCount(counter?.count ?? 0);
          }
        } catch (e) {
          console.log(e);
        }
      };

      // const listener = program.addEventListener('Count', loadCount);
      // unsubs.push(() => {
      //   program.removeEventListener(listener);
      // });

      const subscribeToCountChange = async () => {
        const counterPubkey = await program.account.counter.associatedAddress(
          userPubKey
        );
        const sid = connection.onAccountChange(counterPubkey, loadCount);
        unsubs.push(() => {
          connection.removeAccountChangeListener(sid);
        });
      };

      loadCount();
      subscribeToCountChange();
    }

    return () => unsubs.forEach((unsub) => unsub());
  }, [connected, userPubKey, program, connection]);

  const initializeCounter = useCallback(async () => {
    if (!(program && provider)) return;

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
  }, [program, provider, userPubKey]);

  const incrementCount = useCallback(async () => {
    if (!(program && provider)) return;
    if (!connected) return wallet.connect();

    let counter;
    try {
      counter = await program.account.counter.associated(userPubKey);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );
    await program.rpc.increment({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });
  }, [connected, wallet, userPubKey, initializeCounter, program, provider]);

  const decrementCount = useCallback(async () => {
    if (!(program && provider)) return;
    if (!connected) return wallet.connect();

    let counter;
    try {
      counter = await program.account.counter.associated(userPubKey);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );
    await program.rpc.decrement({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });
  }, [connected, wallet, userPubKey, initializeCounter, program, provider]);

  const resetCount = useCallback(async () => {
    if (!(program && provider)) return;
    if (!connected) return wallet.connect();

    let counter;
    try {
      counter = await program.account.counter.associated(userPubKey);
    } catch (e) {}
    if (!counter) {
      await initializeCounter();
    }
    const counterPubKey = await program.account.counter.associatedAddress(
      userPubKey
    );
    await program.rpc.reset({
      accounts: {
        counter: counterPubKey,
        authority: userPubKey,
      },
    });
  }, [connected, wallet, userPubKey, initializeCounter, program, provider]);

  return (
    <Box className={classes.container}>
      <div className='flex justify-center items-center'>
        <IconButton aria-label='Decrement Count' onClick={decrementCount}>
          <DecrementCountIcon />
        </IconButton>

        <Chip label={count.toString()} />

        <IconButton aria-label='Increment Count' onClick={incrementCount}>
          <IncrementCountIcon />
        </IconButton>
      </div>

      <Box mt={3}>
        <Button
          variant='contained'
          onClick={resetCount}
          fullWidth
          color='secondary'
        >
          {connected ? 'RESET' : 'CONNECT WALLET'}
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
