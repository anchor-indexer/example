import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  margin: '0 auto 0',
  width: '75rem',
  paddingTop: '10rem',

  [breakpoints.down('md')]: {
    width: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
}));
