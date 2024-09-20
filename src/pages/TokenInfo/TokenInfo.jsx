import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { contract } from "../../web3Config";
import { contract2 } from "../../contractConfig";
import "../Home/home.css";
import CandleStickChart from "../../components/CandleStickChart";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { WalletContext } from "../../context/WalletContext";
import { storeTransaction } from "../../components/StoreTransaction";
import { fetchEthToUsdRate } from "../../components/FetchEthToUsdRate";
import {calculateMarketCap} from "../../components/CalculateMarketCap"
import {fetchTokenPrice} from "../../components/FetchTokenPrice"
import {storeTokenPrice} from "../../components/StoreTokenPrice"
import TransactionTable from "../../components/TransactionTable";
import Loader from "../../components/Loader";
import Web3 from "web3";

const TokenInfo = () => {
  const location = useLocation();
  // const [showSwappingDiv, setShowSwappingDiv] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { tokenName } = location.state || {};
  const [tokenAddress, setTokenAddress] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [remainingPercentage, setRemainingPercentage] = useState("0%");
  const [isBuying, setIsBuying] = useState(true);
  const [transactionResult, setTransactionResult] = useState("");
  const [marketCapUsd, setMarketCapUsd] = useState("0.00");
  const [pricePerToken, setPricePerToken] = useState("0.00");
  const { userAccount } = useContext(WalletContext);
  const [amount, setAmount] = useState(0);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");


  // Fetch token data
  useEffect(() => {
    if (tokenName) {
      const fetchTokenData = async () => {
        try {
          const tokenInfo = await contract2.methods.listTokenDetailsByName(tokenName).call();
          const remaining = await contract2.methods.getRemainingTokensPercentage(tokenName).call();
          const ethToUsdRate = await fetchEthToUsdRate();
          const marketCap = await calculateMarketCap(tokenName, ethToUsdRate);
          const price = await fetchTokenPrice(tokenName);

          setRemainingPercentage(`${remaining}%`);
          setMarketCapUsd(marketCap);
          setPricePerToken(price);

          await storeTokenPrice(tokenInfo.tokenAddress, price);

          const response = await fetch(`https://memhome-server-iota.vercel.app/api/tokens/address/${tokenInfo.tokenAddress}`);
          if (!response.ok) throw new Error("Network response was not ok");

          const tokenData = await response.json();
          setTokenDetails({
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            creatorAddress: tokenInfo.creator,
            address: tokenInfo.tokenAddress,
            image: tokenData.data.imageUrl || "",
            website: tokenData.data.website || "#",
            telegram: tokenData.data.telegram || "#",
            twitter: tokenData.data.twitter || "#",
          });

          setTokenAddress(tokenInfo.tokenAddress); // Update tokenAddress state
        } catch (error) {
          console.error("Error fetching token data:", error);
          setTokenDetails({
            name: tokenName,
            symbol: "",
            creatorAddress: "",
            address: "",
            image: "/public/dog.jpg",
            website: "#",
            telegram: "#",
            twitter: "#",
          });
        }
      };

      fetchTokenData();
    }
  }, [tokenName]);

  if (!tokenDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Address not available";

  // Perform Transaction
  const performTransaction = async () => {
    if (!userAccount) {
      setTransactionResult("Please connect your wallet first.");
      return;
    }

    const tokenNameInput = document.getElementById("tokenName1").value;
    if (!tokenNameInput) {
      setTransactionResult("Please enter a token name.");
      return;
    }

    try {
      if (isBuying) {
        await buyToken(tokenNameInput);
      } else {
        await sellToken(tokenNameInput);
      }
    } catch (error) {
      setTransactionResult(`Transaction failed: ${error.message}`);
    }
  };

  const buyToken = async (tokenName) => {
    const ethAmount = parseFloat(document.getElementById("mainAmount").value);
    if (isNaN(ethAmount) || ethAmount <= 0) {
        setTransactionResult("Please enter a valid ETH amount.");
        return;
    }
  
    try {
        const receipt = await contract.methods.buyToken(tokenName).send({
            from: userAccount,
            value: web3.utils.toWei(ethAmount.toString(), "ether"),
        });
        // console.log("Transaction Receipt:", receipt);
        setTransactionResult("Token purchase successful!");
  
        // Use the correct event name
        const event = receipt.events.TokenBoughtFromContract; // Adjusted event name
  
        if (event) {
            const { returnValues } = event;
            const userAddress = returnValues[0];
            const tknName = returnValues[1];
            const ethQuantity = returnValues[2];
            const tokenQuantity = returnValues[3];
            const txHash = receipt.transactionHash;
  
            const tokenAddress = tokenDetails.address;
            const tokenImage = tokenDetails.image;
  
            try {
                const wasAdded = await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: tokenAddress,
                            image: tokenImage,
                        },
                    },
                });
                // console.log(tknName);
                // console.log(tokenQuantity); // Ensure this is a number
                // console.log(ethQuantity); // Ensure this is a number
                // console.log(userAddress);
  
                if (wasAdded) {
                    console.log("Token added to wallet!");
                } else {
                    console.log("Token not added.");
                }
            } catch (addError) {
                console.error("Error adding token to wallet:", addError);
            }
  
            storeTransaction(
                "buy",
                tknName,
                tokenQuantity,
                ethQuantity,
                txHash,
                userAddress
            );
        } else {
            console.error("Event TokenBoughtFromContract not found in the receipt.");
        }
    } catch (error) {
        console.error("Purchase Error:", error);
        setTransactionResult(`Token purchase failed: ${error.message}`);
    }
  };
  

// Sell Token
const sellToken = async (tokenName) => {
  const tokenAmount = parseFloat(document.getElementById("mainAmount").value);
  if (isNaN(tokenAmount) || tokenAmount <= 0) {
      setTransactionResult("Please enter a valid token amount.");
      return;
  }

  try {
      const receipt = await contract.methods.sellToken(tokenName, tokenAmount).send({ from: userAccount });
      // console.log("Transaction Receipt:", receipt);
      setTransactionResult("Token sale successful!");

      // Use the correct event name
      const event = receipt.events.TokenSoldToContract; // Adjusted event name

      if (event) {
          const { returnValues } = event;
          const userAddress = returnValues[0];
          const tknName = returnValues[1];
          const tokenQuantity = returnValues[2];
          const ethQuantity = returnValues[3];
          const txHash = receipt.transactionHash;

          storeTransaction(
              "sell",
              tknName,
              tokenQuantity,
              ethQuantity,
              txHash,
              userAddress
          );
      } else {
          console.error("Event TokenSoldToContract not found in the receipt.");
      }
      
  } catch (error) {
      console.error("Sale Error:", error);
      setTransactionResult(`Token sale failed: ${error.message}`);
  }
};



  // Update Estimates
  const updateEstimates = async () => {
    const tokenNameInput = document.getElementById("tokenName1").value;
    const amountInput = document.getElementById("mainAmount").value;

    if (!tokenNameInput || isNaN(amountInput) || amountInput <= 0) {
      document.getElementById("secondaryAmount").value = "";
      return;
    }

    try {
      const tokenPriceWei = await contract.methods.calculateTokenPrice(tokenNameInput).call();
      const weiAmount = web3.utils.toWei(amountInput, "ether");
      const netWeiAmount = (BigInt(weiAmount) * BigInt(98)) / BigInt(100);

      if (isBuying) {
        const tokenAmount = netWeiAmount / BigInt(tokenPriceWei);
        document.getElementById("secondaryAmount").value = tokenAmount.toString();
      } else {
        const tokenAmount = BigInt(amountInput);
        const weiAmountForTokens = tokenAmount * BigInt(tokenPriceWei);
        const ethAmount = Number(weiAmountForTokens) / 1e18;
        document.getElementById("secondaryAmount").value = ethAmount.toFixed(10);
      }
    } catch (error) {
      console.error("Error updating estimates:", error);
      document.getElementById("secondaryAmount").value = "";
    }
  };

  // Toggle Mode
  const toggleMode = () => {
    setIsBuying(!isBuying);
    setAmount(0);
    const mainAmountInput = document.getElementById("mainAmount");
    const secondaryAmountInput = document.getElementById("secondaryAmount");
    if (mainAmountInput) mainAmountInput.value = "";
    if (secondaryAmountInput) secondaryAmountInput.value = "";
  };

  return (
    <div>
      <div className="bg-transparent max-w-screen-xl mx-auto ml-4 transform scale-90 w-[90vw] space-x-4">
        <div className="flex flex-col lg:flex-row gap-8 ">
          <div className="flex-1 w-[65vw]">
            <div className=" rounded-lg p-2 bg-transparent flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-2 lg:w-[60vw]">
              {/* Left Side: Image */}
              <div className="flex-shrink-0">
                <img
                  src={tokenDetails.image}
                  alt={tokenDetails.name || "Token Image"}
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              {/* Middle Section: Name, Symbol, Market Cap, and Price */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-2">
                  <h2 className="text-4xl font-semibold">
                    {tokenDetails?.name}
                  </h2>
                </div>
                <div>
                  <p className="text-gray-400 text-3xl">
                    <span className="text-[#00BFFF]">
                      {tokenDetails?.symbol}
                    </span>
                  </p>
                </div>
                <div className="mt-1 mb-1">
                  <p className="text-gray-400 text-1xl">
                    <span className="text-[#00BFFF]">${pricePerToken}</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    Market Cap:{" "}
                    <span className="text-[#00BFFF]">${marketCapUsd}</span>
                  </p>
                </div>
                <div className="sm:hidden mt-1">
                  <p className="text-gray-400 text-sm">
                    Remaining:{" "}
                    <span className="text-[#00BFFF]">
                      {remainingPercentage}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: Address */}
              <div className="flex-shrink-0 flex flex-col space-y-2">
                <div className="text-gray-300 flex items-center space-x-1">
                  <span className="font-medium">Address:</span>
                  <span className="text-sm">
                    {formatAddress(tokenDetails?.address)}
                  </span>
                  <CopyToClipboard text={tokenDetails?.address}>
                    <i className="fa-regular fa-copy text-md text-[#00BFFF] cursor-pointer ml-2"></i>
                  </CopyToClipboard>
                </div>
                <div className="text-gray-300 flex items-center space-x-1 space-y-2 mt-4">
                  <span className="font-medium">Creator:</span>
                  <span className="text-sm">
                    {formatAddress(tokenDetails?.creatorAddress)}
                  </span>
                  <CopyToClipboard text={tokenDetails?.creatorAddress}>
                    <i className="fa-regular fa-copy text-md text-[#00BFFF] cursor-pointer ml-2"></i>
                  </CopyToClipboard>
                </div>
                <div className="flex space-x-3 mt-2">
                  <a
                    href={tokenDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg"
                  >
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a
                    href={tokenDetails.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg"
                  >
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a
                    href={tokenDetails.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg"
                  >
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-1  mt-4">
              <h2 className="text-xl font-semibold mb-1">Bonding Curve</h2>
              <div className="chart">
                <CandleStickChart tokenAddress={tokenAddress} />
              </div>

            </div>
          </div>

          <div className="mt-10 rounded-lg p-4 w-full lg:w-[55vw] flex flex-col gap-10 space-y-8 -mr-16">
            {/* Hidden Progress Bar on Small Screens */}
            <div className="rounded-lg bg-gray-800 p-5 hidden lg:block">
              <div className="flex items-center justify-between mb-1">
                <span>Remaining:</span>
                <span className="text-green-500">{remainingPercentage}</span>
              </div>
            </div>

            {/* Swapping Section on Large Screens */}
            <div className="lg:block hidden">
              <div className="relative bg-gray-800 p-4 rounded-lg w-full space-y-10">
                {/* Swap Inputs */}
                <div className="mb-4 hidden">
                  <label className="block text-sm font-medium text-gray-300">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="tokenName1"
                    readOnly
                    value={tokenDetails?.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  />
                </div>

                <div className="flex flex-col items-center mb-4 space-y-3">
                  <div className="w-full flex mb-6">
                    <div className="px-3 py-2 border border-r-0 border-gray-600 rounded-l-md bg-gray-700 text-white flex items-center">
                      {isBuying ? "ETH" : tokenDetails?.symbol}
                    </div>
                    <input
                      type="text"
                      id="mainAmount"
                      placeholder={isBuying ? "Enter amount" : "Enter amount"}
                      className="block w-full px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-white"
                      onChange={(e) => {
                        setAmount(e.target.value);
                        updateEstimates();
                      }}
                    />
                  </div>
                  <i
                    className="fas fa-exchange-alt text-3xl cursor-pointer text-indigo-500 "
                    onClick={toggleMode}
                  ></i>
                </div>

                <div className="flex flex-col items-center mb-6 space-y-1 ">
                  <div className="w-full flex ">
                    <div className="px-3 py-2 border border-r-0 border-gray-600 rounded-l-md bg-gray-700 text-white flex items-center">
                      {isBuying ? tokenDetails?.symbol : "ETH"}
                    </div>
                    <input
                      type="text"
                      id="secondaryAmount"
                      placeholder={isBuying ? "Token Amount" : "ETH Amount"}
                      readOnly
                      className="block w-full px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={performTransaction}
                  id="actionButton"
                  className="w-full py-2 bg-blue-600 text-xl text-white rounded-lg"
                >
                  {isBuying ? "Buy 😊" : "Sell 🥺"}
                </button>

                {/* {transactionResult && (
                <div className="mt-4 text-green-400">{transactionResult}</div>
              )} */}
              </div>
            </div>

            {/* Trade Button on Small Screens */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg"
              >
                Trade
              </button>
            </div>
          </div>
        </div>

        {/* Swapping Popup (shown on small screens) */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="relative bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <button
                className="absolute top-2 right-2 text-white"
                onClick={() => setIsPopupOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              {/* Swap Inputs */}
              <div className="mb-4 hidden">
                <label className="block text-sm font-medium text-gray-300">
                  Name:
                </label>
                <input
                  type="text"
                  id="tokenName1"
                  readOnly
                  value={tokenDetails?.name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col items-center mb-6 space-y-1">
                <div className="w-full flex mb-6">
                  <div className="px-3 py-2 border border-r-0 border-gray-600 rounded-l-md bg-gray-700 text-white flex items-center">
                    {isBuying ? "ETH" : tokenDetails?.symbol}
                  </div>
                  <input
                    type="text"
                    id="mainAmount"
                    placeholder={isBuying ? "Enter amount" : "Enter amount"}
                    className="block w-full px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-white"
                    onChange={(e) => {
                      setAmount(e.target.value);
                      updateEstimates();
                    }}
                  />
                </div>

                <i
                  className="fas fa-exchange-alt text-4xl cursor-pointer text-indigo-500"
                  onClick={toggleMode}
                ></i>

                <div className="flex flex-col items-center mb-6 space-y-1 ">
                  <div className="w-full flex mt-6">
                    <div className="px-3 py-2 border border-r-0 border-gray-600 rounded-l-md bg-gray-700 text-white flex items-center">
                      {isBuying ? tokenDetails?.symbol : "ETH"}
                    </div>
                    <input
                      type="text"
                      id="secondaryAmount"
                      placeholder={isBuying ? "Token Amount" : "ETH Amount"}
                      readOnly
                      className="block w-full px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={performTransaction}
                id="actionButton"
                className="w-full py-2 bg-blue-600 text-xl text-white rounded-lg"
              >
                {isBuying ? "Buy 😊" : "Sell 🥺"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mb-2 mt-[-5%]">
        <TransactionTable tokenName={tokenName} />
      </div>
      <footer className="relative bottom-0 left-0 right-0 text-center p-2 bg-transparent text-white text-xs mt-[2%]">
        <span>© 2024 Memehome. All rights reserved</span>
      </footer>
    </div>
  );
};

export default TokenInfo;
