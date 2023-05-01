import { Buffer } from 'buffer';

import React from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/css';
import App from '@app/components/global/App';

window.Buffer = Buffer;

declare global {
  interface Window {
    Buffer: any;
  }
}

window.Buffer = Buffer;

const container = document.getElementById('root')!;

createRoot(container).render(<App />);
