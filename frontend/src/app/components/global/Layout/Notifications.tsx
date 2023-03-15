import React, { FC } from 'react';
import { Toaster } from 'react-hot-toast';

export const Notifications: FC = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: 'rgba(78, 68, 206)',
          color: 'white',
          width: 'auto',
        },
        success: {
          style: {
            background: '#3aff6f',
            color: '#190834',
          },
        },
        error: {
          style: {
            background: 'rgba(235, 55, 66)',
          },
        },
      }}
      position='bottom-center'
      reverseOrder={false}
    />
  );
};

export default Notifications;
