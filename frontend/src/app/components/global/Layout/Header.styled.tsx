import {
  styled,
  AppBar as BaseAppBar,
  Toolbar as BaseToolbar,
} from '@mui/material';
import { NavLink as BaseNavLink } from 'react-router-dom';

export const AppBar = styled(BaseAppBar)(({ theme: { breakpoints } }) => ({
  boxShadow: 'none',
  background: '#111111',
}));

export const Toolbar = styled(BaseToolbar)(({ theme: { breakpoints } }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export const NavLink = styled(BaseNavLink)(
  ({ theme: { breakpoints, palette } }) => ({
    color: palette.text.primary,
    textDecoration: 'none',

    '&.active': {
      textDecoration: 'underline',
    },
  })
);
