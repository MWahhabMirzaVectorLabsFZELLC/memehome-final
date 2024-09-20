import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import { WalletContext } from "../../context/WalletContext";
import "../Home/home.css";
import { contract } from "../../web3Config";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { fetchEthToUsdRate } from "../../components/FetchEthToUsdRate";
import { fetchTokenPrice } from "../../components/FetchTokenPrice";
import { fetchTokenDetails } from "../../components/TokenDetails";


const MyProfile = () => {
	const { userAccount } = useContext(WalletContext);
	const [userTokens, setUserTokens] = useState([]);
	const [filteredTokens, setFilteredTokens] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const tokensPerPage = 6;
	const navigate = useNavigate();

	const indexOfLastToken = currentPage * tokensPerPage;
	const indexOfFirstToken = indexOfLastToken - tokensPerPage;
	const currentTokens = filteredTokens.slice(
		indexOfFirstToken,
		indexOfLastToken
	);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};


	const calculateMarketCap = async (tokenName, initialSupply, ethToUsdRate) => {
		try {
		  const currentPriceGwei = BigInt(
			await contract.methods.calculateTokenPrice(tokenName).call()
		  );
		  const marketCapGwei = initialSupply * currentPriceGwei;
		  const marketCapEther = Number(marketCapGwei) / 1e18;
		  const marketCapUsd = marketCapEther * ethToUsdRate;
		  return marketCapUsd.toFixed(2);
		} catch (error) {
		  console.error(`Error calculating market cap for ${tokenName}:`, error);
		  return "0.00";
		}
	  };

	const loadUserTokens = async () => {
		try {
			if (!userAccount) {
				throw new Error("User account not found");
			}

			const totalTokens = await contract.methods.listTokens().call();
			const ethToUsdRate = await fetchEthToUsdRate();
			const initialSupply = BigInt(1e9);

			let tokens = [];

			for (let i = 0; i < totalTokens.length; i++) {
				const tokenName = totalTokens[i];
				const userTokenBalance = BigInt(
					await contract.methods
						.checkUserTokenBalance(tokenName)
						.call({ from: userAccount })
				);

				if (userTokenBalance > 0) {
					const tokenInfo = await contract.methods
						.listTokenDetailsByName(tokenName)
						.call();
					const marketCapUsd = await calculateMarketCap(
						tokenName,
						initialSupply,
						ethToUsdRate
					);
					const priceInUsd = await fetchTokenPrice(tokenName);
					const userTokenBalanceNumber = Number(userTokenBalance);
					const userTokenPercentage =
						(userTokenBalanceNumber * 100) / Number(initialSupply);
					const numberOfTokensHeld =
						(userTokenPercentage / 100) * Number(initialSupply);
					const tokenDetails = await fetchTokenDetails(tokenInfo.tokenAddress);

					tokens.push({
						name: tokenInfo.name,
						symbol: tokenInfo.symbol,
						balance: userTokenBalance.toString(),
						holdings: userTokenPercentage.toFixed(6),
						numberOfTokensHeld: numberOfTokensHeld.toFixed(2),
						marketCapUsd,
						price: priceInUsd, // Price in USD
						creator: tokenInfo.creator,
						address: tokenInfo.tokenAddress,
						image: tokenDetails.imageUrl,
						website: tokenDetails.website,
						telegram: tokenDetails.telegram,
						twitter: tokenDetails.twitter,
					});
				}
			}

			setUserTokens(tokens);
			setFilteredTokens(tokens);
			setLoading(false);
		} catch (error) {
			console.error("Error loading user tokens:", error);
			setError("Failed to load tokens. Please try again later.");
			setLoading(false);
		}
	};

	useEffect(() => {
		if (userAccount) {
			loadUserTokens();
		}
	}, [userAccount]);

	const handleTokenClick = (token) => {
		navigate("/token-info", {
			state: { tokenName: token.name, tokenAddress: token.address },
		});
	};

	if (!userAccount) {
		return <div>Please connect your wallet to view your profile.</div>;
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader />
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<>
			<div className="min-h-screen flex items-center justify-center px-2 py-8 md:px-10 md:py-12 heading1">
				<div className="w-full max-w-screen-lg">
					<h2 className="text-xl font-semibold mb-3 text-center">My Profile</h2>
					<p className="font-medium mb-8 flex items-center justify-center">
						<MdManageAccounts className="mr-2 text-lg text-blue-500" />
						Account:{" "}
						<span className="ml-2 text-slate-400 font-normal">
							{window.innerWidth < 768
								? `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`
								: userAccount}
						</span>
					</p>

					<h3 className="text-lg font-medium mb-4 text-center">Your Tokens</h3>
					{filteredTokens.length > 0 ? (
						<>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{currentTokens.map((token, index) => (
									<div
										key={index}
										className="bg-gray-800 rounded-lg p-3 cursor-pointer border border-blue-500 transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-[0_0_20px_10px_rgba(0,120,255,0.5)]"
										style={{
											maxWidth: "90%",
											marginRight: "auto",
											marginLeft: "auto",
											height: "auto", // Keep uniform height
										}}
										onClick={() => handleTokenClick(token)}
									>
										<div className="flex items-center mb-3 gap-3">
											<img
												src={token.image}
												alt={token.name}
												className="w-10 h-10 object-contain "
											/>
											<div className="flex-1 min-w-0">
												<h3 className="text-sm font-semibold uppercase truncate">
													{token.name.length > 8
														? `${token.name.slice(0, 8)}...`
														: token.name}
												</h3>
												<p className="text-gray-400 text-xs truncate">
													Symbol: {token.symbol}
												</p>
											</div>
										</div>

										{/* Full details shown only on medium to large screens */}
										<div className="hidden md:block text-xs">
											<p className="text-gray-300 font-semibold truncate">
												Number of Tokens Hold:{" "}
												<span className="text-[#00BFFF] font-normal">
													{token.numberOfTokensHeld}
												</span>
											</p>
											<p className="text-gray-300 font-semibold truncate">
												Your Holdings:{" "}
												<span className="text-[#00BFFF] font-normal">
													{token.holdings}%
												</span>
											</p>
											<p className="text-gray-300 font-semibold truncate">
												Market Cap:{" "}
												<span className="text-[#00BFFF] font-normal">
													${token.marketCapUsd}
												</span>
											</p>
											<p className="text-gray-300 font-semibold truncate">
												Price:{" "}
												<span
													className="text-[#00BFFF] font-normal"
													style={{
														textShadow: "0px 0px 6px rgba(0, 191, 255, 0.8)",
													}}
												>
													${token.price} USD
												</span>
											</p>
										</div>
									</div>
								))}
							</div>
							<div className="flex px-4 md:px-16 justify-center mt-6">
								<Pagination
									tokensPerPage={tokensPerPage}
									totalTokens={filteredTokens.length}
									currentPage={currentPage}
									handlePageChange={handlePageChange}
								/>
							</div>
						</>
					) : (
						<p className="text-center">No tokens found.</p>
					)}
				</div>
			</div>
			<footer className="relative bottom-0 left-0 right-0 text-center p-2 bg-transparent text-white text-xs">
				<span>© 2024 Memehome. All rights reserved</span>
			</footer>
		</>
	);
};

export default MyProfile;
