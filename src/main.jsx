import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import { WalletProvider } from './context/WalletContext';

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with the WalletProvider wrapped around it
root.render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
