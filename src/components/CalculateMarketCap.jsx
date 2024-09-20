import { contract } from "../web3Config";

export const calculateMarketCap = async (tokenName, ethToUsdRate) => {
	try {
		const initialSupply = BigInt(1e9);
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
