import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { skipToChallenge } from './utils/progressManager';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Expose for testing purposes
(window as any).skipToChallenge = skipToChallenge;
console.log('skipToChallenge function exposed globally.');

