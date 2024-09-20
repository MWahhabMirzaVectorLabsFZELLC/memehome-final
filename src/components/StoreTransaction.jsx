export const storeTransaction = async (
	type,
	tknName,
	tokenQuantity,
	ethQuantity,
	txHash,
	userAddress
) => {
	// Validate `type`
	if (type !== "buy" && type !== "sell") {
		console.error('Invalid type. Must be either "buy" or "sell".');
		return;
	}

	// Log received values
	//   console.log('Received data for storage:', { tknName, tokenQuantity, ethQuantity, type, userAddress, txHash });

	// Convert BigInt to string (if applicable)
	const tokenAmount =
		typeof tokenQuantity === "bigint"
			? tokenQuantity.toString()
			: tokenQuantity;
	const ethAmt =
		typeof ethQuantity === "bigint" ? ethQuantity.toString() : ethQuantity;

	// Validate and convert `tokenAmount`
	const amount = parseFloat(tokenAmount);
	if (isNaN(amount)) {
		console.error("Invalid tokenAmount. Must be a number.", {
			tokenQuantity,
			tokenAmount,
			ethQuantity,
			ethAmt,
		});
		return;
	}

	// Log to verify the values before sending the request
	//   console.log('Sending transaction data:', { tknName, tokenQuantity: amount, ethQuantity: ethAmt, type, userAddress, txHash });

	try {
		const response = await fetch("https://memhome-server-iota.vercel.app/api/transactions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tknName,
				tokenQuantity: amount, // Ensure tokenAmount is passed here
				type,
				userAddress,
				ethQuantity: ethAmt,
				txHash,
				timestamp: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`HTTP error! Status: ${response.status}, Details: ${errorText}`
			);
		}

		const result = await response.json();
		//   console.log("Transaction stored successfully:", result);
	} catch (error) {
		console.error("Error storing transaction:", error);
	}
};
