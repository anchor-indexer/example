import { FC } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { APP_NAME } from 'config';
import { useWallet } from 'contexts/wallet';

const useStyles = makeStyles((theme) => ({
  container: {
    background: 'black',
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
}));

const Header: FC = () => {
  const classes = useStyles();
  const { connected, wallet } = useWallet();

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className={'flex flex-grow'}>
          <Link to={'/'} className={classes.link}>
            {APP_NAME}
          </Link>
        </Typography>

        {connected ? (
          <>
            <Box mr={2} className={'flex items-center'}>
              <Link to={'/wallet'} className={classes.link}>
                {wallet.publicKey.toBase58()} (Wallet)
              </Link>
            </Box>
            <Button color='secondary' onClick={wallet.disconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button color='secondary' onClick={wallet.connect}>
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
