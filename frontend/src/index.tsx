import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ConnectionProvider } from 'contexts/connection';
import { WalletProvider } from 'contexts/wallet';
import { ProgramsProvider } from 'contexts/programs';
import { UIProvider } from 'contexts/ui';

import Counter from 'pages/Counter';
import Wallet from 'pages/Wallet';

import App from 'components/global/App';
import theme from 'utils/theme';
import './styles.css';

render(
  <StrictMode>
    <ThemeProvider {...{ theme }}>
      <CssBaseline />

      <ConnectionProvider>
        <WalletProvider>
          <ProgramsProvider>
            <UIProvider>
              <BrowserRouter>
                <App>
                  <Switch>
                    <Route path='/counter'>
                      <Counter />
                    </Route>
                    <Route path='/wallet'>
                      <Wallet />
                    </Route>
                    <Redirect to='/counter' />
                  </Switch>
                </App>
              </BrowserRouter>
            </UIProvider>
          </ProgramsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
