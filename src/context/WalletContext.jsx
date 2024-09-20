import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAccount, setUserAccount] = useState(null);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setWalletConnected(true);
        setUserAccount(accounts[0]);
      } else {
        setWalletConnected(false);
        setUserAccount(null);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkWalletConnection();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setUserAccount(null);
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ walletConnected, userAccount, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };
