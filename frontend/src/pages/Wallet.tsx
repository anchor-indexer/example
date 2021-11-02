import { FC, useCallback, useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { useConnection } from 'contexts/connection';
import { useWallet } from 'contexts/wallet';

const useStyles = makeStyles(() => {
  return {
    container: {
      width: 600,
      margin: '0 auto',
    },
  };
});

const Home: FC = () => {
  const classes = useStyles();
  const connection = useConnection();
  const { connected, publicKey: userAccount } = useWallet();
  const [balance, setBalance] = useState(0);

  const airdrop = useCallback(async () => {
    if (userAccount) {
      await connection.requestAirdrop(userAccount, 2 * LAMPORTS_PER_SOL);
      console.log('done');
    }
  }, [userAccount, connection]);

  useEffect(() => {
    if (!connection) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    if (connected) {
      const loadBalance = async () => {
        const balance = await connection.getBalance(userAccount);
        if (isMounted) {
          setBalance(balance);
        }
      };

      const sid = connection.onAccountChange(userAccount, loadBalance);
      unsubs.push(() => {
        connection.removeAccountChangeListener(sid);
      });

      loadBalance();
    }

    return () => unsubs.forEach((unsub) => unsub());
  }, [connection, connected, userAccount]);

  return (
    <Box className={classes.container}>
      <Table aria-label='Balances' size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component='th' scope='row'>
              SOL
            </TableCell>
            <TableCell>{balance / LAMPORTS_PER_SOL}</TableCell>
            <TableCell>
              <Button
                variant='contained'
                onClick={airdrop}
                fullWidth
                color='secondary'
                disabled={!connected}
              >
                AIRDROP
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default Home;
