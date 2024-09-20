
export const fetchEthToUsdRate = async () => {
    const apiKey = "WPVSPF45M2E9ESQJIR6UHGR5GTWYRQRY6J";
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      if (data.status === "1") {
        return parseFloat(data.result.ethusd);
      } else {
        throw new Error(data.result);
      }
    } catch (error) {
      console.error("Error fetching ETH to USD rate:", error);
      return 1800; // Fallback rate
    }
  };