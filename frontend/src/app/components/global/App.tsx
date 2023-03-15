import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

import muiTheme from '@styles/mui-theme';

import { ConnectionWalletAdapterProvider } from '@app/contexts/connection-wallet-adapter';
import { ConnectionProvider } from '@app/contexts/connection';
import { WalletProvider } from '@app/contexts/wallet';
import { AnchorProviderProvider } from '@app/contexts/provider';
import { ProgramsProvider } from '@app/contexts/programs';
import { TxProvider } from '@app/contexts/tx';
import { CounterProvider } from '@app/contexts/counter';
import { StoreProvider } from '@app/contexts/store';

import Layout from './Layout/Layout';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <ConnectionWalletAdapterProvider>
        <ConnectionProvider>
          <WalletProvider>
            <AnchorProviderProvider>
              <ProgramsProvider>
                <StoreProvider>
                  <MUIThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <TxProvider>
                      <CounterProvider>
                        <Layout />
                      </CounterProvider>
                    </TxProvider>
                  </MUIThemeProvider>
                </StoreProvider>
              </ProgramsProvider>
            </AnchorProviderProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ConnectionWalletAdapterProvider>
    </BrowserRouter>
  );
};

export default App;
