import React, { FC, useCallback } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import * as anchor from '@project-serum/anchor';

import { useConnection } from '@app/contexts/connection';
import { useWallet } from '@app/contexts/wallet';
import { useStore } from '@app/contexts/store';
import { formatPreciseNumber } from '@app/utils/bn';
import { alertRequestError } from '@app/utils/request';

import * as S from './Wallet.styled';

const Home: FC = () => {
  const connection = useConnection();
  const { publicKey } = useWallet();
  const { solBalance: balance } = useStore();

  const airdrop = useCallback(async () => {
    if (publicKey) {
      try {
        await connection.requestAirdrop(
          publicKey,
          1 * anchor.web3.LAMPORTS_PER_SOL
        );
        console.log('done');
      } catch (e) {
        alertRequestError(e);
      }
    }
  }, [publicKey, connection]);

  return (
    <S.Container>
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
            <TableCell>{formatPreciseNumber(balance)}</TableCell>
            <TableCell>
              <Button
                variant='contained'
                onClick={airdrop}
                fullWidth
                color='secondary'
                disabled={!publicKey}
              >
                AIRDROP
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </S.Container>
  );
};

export default Home;
