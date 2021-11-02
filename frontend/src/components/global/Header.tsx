import { FC } from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';

import { APP_NAME } from 'config';

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

        <Box marginTop={-1.5}>
          <WalletMultiButton color='secondary' variant='text' />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
