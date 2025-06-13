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

// More explicit global assignment with debugging
console.log('About to assign skipToChallenge to window...');
console.log('skipToChallenge function:', skipToChallenge);
console.log('typeof skipToChallenge:', typeof skipToChallenge);

// Try multiple assignment methods
(window as any).skipToChallenge = skipToChallenge;
(globalThis as any).skipToChallenge = skipToChallenge;

// Verify the assignment worked
console.log('After assignment - window.skipToChallenge:', (window as any).skipToChallenge);
console.log('After assignment - typeof window.skipToChallenge:', typeof (window as any).skipToChallenge);

// Also try a simple test function
(window as any).testFunction = () => {
  console.log('Test function works!');
  return 'success';
};

console.log('Test function assigned:', typeof (window as any).testFunction);

// Try calling skipToChallenge directly from here to test
console.log('Testing direct call to skipToChallenge...');
try {
  // Don't actually skip, just test the function works
  console.log('skipToChallenge function is callable:', typeof skipToChallenge === 'function');
} catch (error) {
  console.error('Error testing skipToChallenge:', error);
}

console.log('Global assignment complete. Try: window.skipToChallenge("calm_creator") or window.testFunction()');