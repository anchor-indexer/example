import { FC } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import IncrementCountIcon from '@material-ui/icons/Add';
import DecrementCountIcon from '@material-ui/icons/Remove';

import { useWallet } from 'contexts/wallet';
import { useCounter } from 'contexts/counter';

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
  const { connected } = useWallet();
  const { count, incrementCount, decrementCount, resetCount } = useCounter();

  return (
    <Box className={classes.container}>
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
          {connected ? 'RESET' : 'CONNECT WALLET'}
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
