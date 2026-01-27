import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Wix Custom Element Lifecycle handling could be added here
// For now, we mount to the root div standard to React apps

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
