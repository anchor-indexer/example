import { FC } from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { APP_NAME, ENDPOINT } from 'config';
import { useWallet } from 'contexts/wallet';
import LinkAddress from 'components/shared/LinkAddress';

const useStyles = makeStyles((theme) => ({
  container: {
    background: 'black',
  },
  logo: {
    marginTop: 2,
  },
  title: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  activeLink: {
    textDecoration: 'underline',
  },
}));

const LINKS = [
  ['Home', '/'],
  ['Wallet', '/wallet'],
];

const Header: FC = () => {
  const classes = useStyles();
  const { connected, wallet } = useWallet();

  const path = window.location.pathname;

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className='flex flex-col'>
          <Link
            className={clsx(classes.title, 'flex flex-grow items-center')}
            to={'/'}
          >
            {APP_NAME}
          </Link>
        </Typography>

        <Box className='flex' ml={4}>
          {LINKS.map(([name, link], idx) => (
            <Link
              key={link}
              to={link}
              className={clsx(classes.link, {
                [classes.activeLink]:
                  idx === 0
                    ? !LINKS.slice(1).find((l) => ~path.indexOf(l[1]))
                    : ~path.indexOf(link), // todo: better compute
              })}
            >
              <Box mx={1}>{name}</Box>
            </Link>
          ))}
        </Box>

        <div className='flex flex-grow'></div>

        {connected ? (
          <>
            <Box mr={2} className={'flex items-center'}>
              <LinkAddress address={wallet.publicKey.toBase58()} /> (
              {ENDPOINT.name})
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
