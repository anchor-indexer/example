import { Buffer } from 'buffer';

import React from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/css';

window.Buffer = Buffer;

declare global {
  interface Window {
    Buffer: any;
  }
}

window.Buffer = Buffer;

const App = React.lazy(() => import('@app/components/global/App'));
const container = document.getElementById('root')!;
createRoot(container).render(<App />);
