import React, { FC } from 'react';
import { Box, Chip, Button, IconButton } from '@mui/material';
import {
  Add as IncrementCountIcon,
  Remove as DecrementCountIcon,
} from '@mui/icons-material';

import { useWallet } from '@app/contexts/wallet';
import { useCounter } from '@app/contexts/counter';

import * as S from './Counter.styled';

const Home: FC = () => {
  const { publicKey } = useWallet();
  const { count, incrementCount, decrementCount, resetCount } = useCounter();

  return (
    <S.Container>
      <Box className='flex justify-center items-center'>
        <IconButton aria-label='Decrement Count' onClick={decrementCount}>
          <DecrementCountIcon />
        </IconButton>

        <Chip label={count.toString()} />

        <IconButton aria-label='Increment Count' onClick={incrementCount}>
          <IncrementCountIcon />
        </IconButton>
      </Box>

      <Box mt={3}>
        <Button
          variant='contained'
          onClick={resetCount}
          fullWidth
          color='secondary'
        >
          {publicKey ? 'RESET' : 'CONNECT WALLET'}
        </Button>
      </Box>
    </S.Container>
  );
};

export default Home;
