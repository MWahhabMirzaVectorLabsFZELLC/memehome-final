import React, { useState } from "react";
import '../Home/home.css';
import { contract, web3 } from '../../web3Config.js';
import axios from 'axios';

const TokenDeployer = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const createToken = async () => {
    setStatus(''); // Clear previous status

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!name || !symbol) {
        setStatus('Please fill in all required fields.');
        return;
      }

      const receipt = await contract.methods.createToken(name, symbol).send({ from: account });
      console.log('Transaction Receipt:', receipt);

      const tokenAddress = receipt.events.TokenCreated.returnValues.tokenAddress;

      // Call the function to upload details to your server
      await uploadTokenDetails(tokenAddress);

      setStatus('Token created and details uploaded successfully!');
    } catch (error) {
      console.error('Error creating token:', error);
      setStatus(`Error creating token: ${error.message}`);
    }
  };

  const uploadTokenDetails = async (tokenAddress) => {
    setStatus(''); // Clear previous status

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('symbol', symbol);
      formData.append('twitter', twitter);
      formData.append('telegram', telegram);
      formData.append('website', website);
      formData.append('tokenAddress', tokenAddress);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('https://memhome-server-iota.vercel.app/api/tokens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Server Response:', response.data);
      setStatus('Token details uploaded successfully!');
    } catch (error) {
      console.error('Error uploading token details:', error);
      setStatus(`Error uploading token details: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-transparent">
      <div className="w-full max-w-md p-8 bg-transparent rounded-lg transform-gpu perspective-1000 transition-all duration-300 ease-in-out rotate-x-10 animate-fadeIn">
        <h1 className="text-xl font-bold text-center text-white mb-6">Token Deployer</h1>

        <div className="space-y-3">
          <InputField
            value={name}
            onChange={(val) => setName(val.toUpperCase())}
            placeholder="ENTER TOKEN NAME"
            required
          />
          <InputField
            value={symbol}
            onChange={(val) => setSymbol(val.toUpperCase())}
            placeholder="ENTER TOKEN SYMBOL"
            required
          />
          <InputField
            value={twitter}
            onChange={setTwitter}
            placeholder="TWITTER LINK (OPTIONAL)"
          />
          <InputField
            value={telegram}
            onChange={setTelegram}
            placeholder="TELEGRAM LINK (OPTIONAL)"
          />
          <InputField
            value={website}
            onChange={setWebsite}
            placeholder="WEBSITE LINK (OPTIONAL)"
          />
          <div className="flex flex-col items-center">
            <input
              type="file"
              className="w-64 sm:w-80 p-3 bg-transparent text-white border-2 border-blue-400 rounded-md placeholder-white shadow-xl transform-gpu transition-transform duration-300 ease-in-out focus:scale-105 focus:rotate-y-12 hover:scale-105 hover:rotate-y-12 outline-none"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={createToken}
              disabled={!name || !symbol}
              className={`px-6 py-3 text-white text-lg rounded-full shadow-xl transform-gpu transition-transform duration-300 ease-in-out 
              ${!name || !symbol ? 'bg-yellow-600 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'}
              focus:outline-none`}
            >
              Create Token 😎
            </button>
          </div>

          {status && (
            <p className={`text-center mt-5 ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 text-center p-2 bg-transparent text-white text-xs">
        <span>© 2024 Memehome. All rights reserved</span>
      </footer>
    </div>
  );
};

const InputField = ({ value, onChange, placeholder, required }) => (
  <div className="flex flex-col items-center">
    <input
      type="text"
      className="w-64 sm:w-80 p-3 bg-transparent text-white border-2 border-blue-400 rounded-md placeholder-white shadow-xl transform-gpu transition-transform duration-300 ease-in-out focus:scale-105 focus:rotate-y-12 hover:scale-105 hover:rotate-y-12 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

export default TokenDeployer;
