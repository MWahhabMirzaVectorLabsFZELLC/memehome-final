import React, { useState, useContext } from "react";
import { FaHome, FaRocket, FaUser, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Web3 from "web3";
import { WalletContext } from "../context/WalletContext";

const Navbar = () => {
	const { walletConnected, connectWallet, disconnectWallet } =
		useContext(WalletContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [hoveredItem, setHoveredItem] = useState(null);

	const walletDownloadLinks = {
		MetaMask: "https://metamask.io/download.html",
		"Coinbase Wallet": "https://www.coinbase.com/wallet",
		"OKX Wallet": "https://www.okx.com/web3",
		"Trust Wallet": "https://trustwallet.com/",
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const switchNetwork = async (web3) => {
		const networkId = "0x2105"; // Replace with the correct network ID for basemainnet

		try {
			await web3.eth.requestAccounts(); // Make sure accounts are unlocked
			await web3.eth.net.getId(); // Ensure the current network ID is available

			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: networkId }],
			});
			console.log("Switched to basemainnet");
		} catch (error) {
			console.error("Failed to switch network:", error);
			alert(
				"Failed to switch network. Please ensure you have the correct network added."
			);
		}
	};

	const handleConnectWallet = async (walletType) => {
		try {
			let connected = false;
			let web3;

			if (walletType === "MetaMask" && window.ethereum) {
				web3 = new Web3(window.ethereum);
				await window.ethereum.request({ method: "eth_requestAccounts" });
				connected = true;
			} else if (
				walletType === "Coinbase Wallet" &&
				window.coinbaseWalletExtension
			) {
				web3 = new Web3(window.coinbaseWalletExtension);
				await window.coinbaseWalletExtension.request({
					method: "eth_requestAccounts",
				});
				connected = true;
			} else if (walletType === "OKX Wallet" && window.okxwallet) {
				web3 = new Web3(window.okxwallet);
				await window.okxwallet.request({ method: "eth_requestAccounts" });
				connected = true;
			} else if (walletType === "Trust Wallet" && window.trustwallet) {
				web3 = new Web3(window.trustwallet);
				await window.trustwallet.request({ method: "eth_requestAccounts" });
				connected = true;
			}

			if (connected) {
				const accounts = await web3.eth.getAccounts();
				const userAccount = accounts[0];
				console.log("Connected account:", userAccount);
				connectWallet(userAccount); // Update WalletContext with connected account

				// Switch to the desired network
				await switchNetwork(web3);
			} else {
				window.open(walletDownloadLinks[walletType], "_blank");
			}

			toggleModal();
		} catch (error) {
			console.error("Error connecting to wallet:", error);
			alert("Failed to connect to wallet");
		}
	};

	return (
		<>
			{/* Navbar positioned to the left */}
			<div className="fixed bottom-0 right-0 top-[2%] left-[4%] flex flex-col items-start z-50 pointer-events-none">
				<div
					className="bg-transparent shadow-lg rounded-[2rem] border 
      border-blue-300 border-opacity-70 p-4 transition-shadow
      duration-300 hover:shadow-[0_0_35px_rgba(173,216,250,0.7)] flex flex-col
      items-center justify-center w-[5%] h-auto mt-auto mr-auto mb-auto z-50 pointer-events-auto"
				>
					<ul className="flex flex-col items-center space-y-2">
						<li>
							<Link
								to="/"
								className="relative text-blue-500 hover:text-blue-700 transition-all duration-300 cursor-pointer p-4"
								onMouseEnter={() => setHoveredItem("Home")}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<FaHome size={22} />
								{hoveredItem === "Home" && (
									<span className="absolute left-16 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm">
										Home
									</span>
								)}
							</Link>
						</li>

						<li>
							<Link
								to="/launch-new-token"
								className={`relative text-blue-500 hover:text-blue-700 transition-all duration-300 cursor-pointer p-4 ${
									walletConnected ? "" : "text-gray-500 cursor-not-allowed"
								}`}
								onMouseEnter={() =>
									!walletConnected && setHoveredItem("Launch New Token")
								}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<FaRocket size={22} />
								{hoveredItem === "Launch New Token" && !walletConnected && (
									<span className="absolute left-16 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm">
										connect your wallet
									</span>
								)}
							</Link>
						</li>

						<li>
							<Link
								to="/my-profile"
								className={`relative text-blue-500 hover:text-blue-700 transition-all duration-300 cursor-pointer p-4 ${
									walletConnected ? "" : "text-gray-500 cursor-not-allowed"
								}`}
								onMouseEnter={() =>
									!walletConnected && setHoveredItem("My Profile")
								}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<FaUser size={22} />
								{hoveredItem === "My Profile" && !walletConnected && (
									<span className="absolute left-16 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm">
										connect your wallet
									</span>
								)}
							</Link>
						</li>

						{/* About Us Link */}
						<li>
							<Link
								to="/about-us"
								className="relative text-blue-500 hover:text-blue-700 transition-all duration-300 cursor-pointer p-4"
								onMouseEnter={() => setHoveredItem("About Us")}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<FaInfoCircle size={22} />
								{hoveredItem === "About Us" && (
									<span className="absolute left-16 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm">
										About Us
									</span>
								)}
							</Link>
						</li>
					</ul>
				</div>
			</div>

			{/* Wallet Button positioned at the top right corner */}
			<div className="absolute top-8 right-4 z-50 pointer-events-auto">
				{!walletConnected ? (
					<button
						onClick={toggleModal}
						className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 transition-all duration-300 flex items-center"
					>
						{/* Show icon on small screens */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 block sm:hidden"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 12H7.5m0 0l3-3m-3 3l3 3M3 3h18v18H3V3z"
							/>
						</svg>
						{/* Show text on medium and larger screens */}
						<span className="hidden sm:inline">Connect Wallet</span>
					</button>
				) : (
					<button
						onClick={disconnectWallet}
						className="bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-300 flex items-center"
					>
						{/* Show icon on small screens */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 block sm:hidden"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 12H7.5m0 0l3-3m-3 3l3 3M3 3h18v18H3V3z"
							/>
						</svg>
						{/* Show text on medium and larger screens */}
						<span className="hidden sm:inline">Connected</span>
					</button>
				)}
			</div>

			{/* Wallet Modal positioned in the center */}
			{isModalOpen && (
				<>
					<div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none"></div>
					<div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto">
						<div className="bg-white rounded-3xl p-8 relative w-11/12 sm:w-96 transition-shadow duration-300">
							<button
								onClick={toggleModal}
								className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
							>
								&times;
							</button>
							<h2 className="text-xl font-bold mb-4 text-center">
								Select a Wallet
							</h2>
							{[
								"MetaMask",
								"Coinbase Wallet",
								"OKX Wallet",
								"Trust Wallet",
							].map((wallet) => (
								<button
									key={wallet}
									onClick={() => handleConnectWallet(wallet)}
									disabled={
										wallet === "OKX Wallet" ||
										wallet === "Coinbase Wallet" ||
										wallet === "Trust Wallet"
									}
									className={`bg-${
										wallet === "MetaMask"
											? "blue-500 hover:bg-blue-700" // Darker blue on hover
											: wallet === "Coinbase Wallet"
											? "green-500"
											: wallet === "OKX Wallet"
											? "red-500"
											: "blue-700"
									} text-white font-bold py-2 px-4 rounded-xl mb-2 w-full 
    ${
			wallet === "OKX Wallet" ||
			wallet === "Coinbase Wallet" ||
			wallet === "Trust Wallet"
				? "opacity-50 cursor-not-allowed"
				: ""
		}`}
								>
									{wallet}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
