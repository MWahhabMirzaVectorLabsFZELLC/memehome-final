import { contract2 } from "../contractConfig";
import { fetchEthToUsdRate } from "./FetchEthToUsdRate";

export const fetchTokenPrice = async (tokenName) => {
	try {
		const currentPriceWei = await contract2.methods
			.calculateTokenPrice(tokenName)
			.call();
			console.log(currentPriceWei)
		const ethAmount = Number(currentPriceWei) / 1e18;
		// console.log(ethAmount)
		const ethToUsdRate = await fetchEthToUsdRate();
		const pricePerTokenUsd = (ethAmount * ethToUsdRate).toFixed(8);
		return pricePerTokenUsd;
	} catch (error) {
		console.error(`Error fetching price for ${tokenName}:`, error.message);
		return "0.00";
	}
};
