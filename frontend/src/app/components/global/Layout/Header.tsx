import React, { FC } from 'react';
import clsx from 'clsx';
import { Box, Typography } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { useLocation } from 'react-router-dom';

import { Link } from '@styles/common';

import * as S from './Header.styled';

const LINKS = [
  ['Home', '/'],
  ['Wallet', '/wallet'],
];

const Header: FC = () => {
  const { pathname } = useLocation();

  return (
    <S.AppBar position='fixed' color='inherit'>
      <S.Toolbar color='inherit'>
        <Typography variant='h6' className='flex flex-col'>
          <Link className={'flex flex-grow items-center'} to={'/'}>
            Counter
          </Link>
        </Typography>

        <Box className='flex' ml={4}>
          {LINKS.map(([name, link], idx) => (
            <S.NavLink
              key={link}
              to={link}
              className={clsx({
                active:
                  idx === 0
                    ? !LINKS.slice(1).find((l) => ~pathname.indexOf(l[1]))
                    : ~pathname.indexOf(link), // todo: better compute
              })}
            >
              <Box mx={1}>{name}</Box>
            </S.NavLink>
          ))}
        </Box>

        <div className='flex flex-grow'></div>

        <Box marginTop={-1.5}>
          <WalletMultiButton color='secondary' variant='text' />
        </Box>
      </S.Toolbar>
    </S.AppBar>
  );
};

export default Header;
