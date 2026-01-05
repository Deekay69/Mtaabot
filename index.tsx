
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  (process.env as any).VITE_CLERK_PUBLISHABLE_KEY ||
  (window as any).__CLERK_KEY__;

if (!PUBLISHABLE_KEY) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <div style={{ padding: '20px', color: 'red', border: '1px solid red', margin: '20px' }}>
        <h2>Setup Error</h2>
        <p>Missing <b>VITE_CLERK_PUBLISHABLE_KEY</b> in <code>.env.local</code>.</p>
        <p>Please check the <code>clerk_setup_guide.md</code> for instructions.</p>
      </div>
    );
  }
  throw new Error("Missing Publishable Key");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
