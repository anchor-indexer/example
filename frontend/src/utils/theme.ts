import { createTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS } from 'config';

export default createTheme({
  typography: {
    fontFamily: ['Source Code Pro', 'Helvetica', 'Arial', 'sans-serif'].join(
      ','
    ),
  },
  palette: {
    type: 'dark',
    background: {
      default: '#141414',
      paper: '#141414',
    },
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#fc0',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: BORDER_RADIUS,
      },
    },
  },
});
