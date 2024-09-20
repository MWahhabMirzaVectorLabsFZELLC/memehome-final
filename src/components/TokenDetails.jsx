export const fetchTokenDetails = async (tokenAddress) => {
    try {
      const response = await fetch(
        `https://memhome-server-iota.vercel.app/api/tokens/address/${tokenAddress}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching token details:", error);
      return {
        imageUrl: "/public/dog.jpg",
        website: "#",
        telegram: "#",
        twitter: "#",
      };
    }
  };