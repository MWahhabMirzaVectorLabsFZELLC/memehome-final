import { contract2 } from "../contractConfig";
import { fetchEthToUsdRate } from "./FetchEthToUsdRate";

export const fetchTokenPrice = async (tokenName) => {
	try {
		const currentPriceGwei = await contract2.methods
			.calculateTokenPrice(tokenName)
			.call();
		const ethAmount = Number(currentPriceGwei) / 1e18;
		const ethToUsdRate = await fetchEthToUsdRate();
		const pricePerTokenUsd = (ethAmount * ethToUsdRate).toFixed(8);
		return pricePerTokenUsd;
	} catch (error) {
		console.error(`Error fetching price for ${tokenName}:`, error.message);
		return "0.00";
	}
};
