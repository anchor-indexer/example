import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Counter from '@app/pages/Counter';
import Wallet from '@app/pages/Wallet';

import Header from './Header';
import Notifications from './Notifications';
import * as S from './Layout.styled';

const Layout: FC = () => {
  useEffect(() => {
    document.getElementById('boot-loader')!.classList.add('hidden');
  }, []);

  return (
    <S.Container>
      <Header />
      <Routes>
        <Route path='/' element={<Counter />} />
        <Route path='/wallet' element={<Wallet />} />
      </Routes>
      <Notifications />
    </S.Container>
  );
};

export default Layout;
