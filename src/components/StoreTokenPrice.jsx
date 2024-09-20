export const storeTokenPrice = async (tokenAddress, price) => {
    try {
      const response = await fetch("https://memhome-server-iota.vercel.app/api/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenAddress, price }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      const resultText = await response.text();
      // console.log("Price stored successfully:", resultText);
    } catch (error) {
      console.error("Error storing token price:", error.message);
    }
  };