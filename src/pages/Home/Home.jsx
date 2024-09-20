import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { contract2 } from "../../contractConfig";
import Card from "../../components/Card";
import "../Home/home.css";
import TokenFilters from "../../components/TokenFilters";
import { fetchTokenDetails } from "../../components/TokenDetails";
import { fetchEthToUsdRate } from "../../components/FetchEthToUsdRate";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const Home = () => {
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchValue: "",
    sortBy: "creationTime",
    sortOrder: "desc",
    status: "all",
    animationsEnabled: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensPerPage, setTokensPerPage] = useState(6);
  const navigate = useNavigate();

  // Memoize the calculateMarketCap function to prevent unnecessary recalculations
  const calculateMarketCap = useCallback(async (tokenName, ethToUsdRate) => {
    try {
      const initialSupply = BigInt(1e9);
      const currentPriceGwei = BigInt(
        await contract2.methods.calculateTokenPrice(tokenName).call()
      );

      const marketCapGwei = initialSupply * currentPriceGwei;
      const marketCapEther = Number(marketCapGwei) / 1e18;
      const marketCapUsd = marketCapEther * ethToUsdRate;

      return marketCapUsd.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.error(`Error calculating market cap for ${tokenName}:`, error);
      return "$0.00";
    }
  }, []);

  // Memoized token loading function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadTokens = useCallback(async () => {
	  setIsLoading(true);
	  try {
		  const ethToUsdRate = await fetchEthToUsdRate();
		  const allTokenInfos = await contract2.methods.listAllTokens().call();
  
		  const tokenPromises = allTokenInfos.map(async (tokenInfo, index) => {
			  try {
				  // Add a delay to prevent too many requests at once
				  await delay(index * 200); // 200ms delay between each request
  
				  const remainingPercentage = await contract2.methods
					  .getRemainingTokensPercentage(tokenInfo.name)
					  .call();
  
				  const marketCapUsd = await calculateMarketCap(
					  tokenInfo.name,
					  ethToUsdRate
				  );
  
				  const tokenDetails = await fetchTokenDetails(tokenInfo.tokenAddress);
  
				  return {
					  name: tokenInfo.name,
					  symbol: tokenInfo.symbol,
					  marketCap: marketCapUsd,
					  remaining: `${remainingPercentage}%`,
					  creatorEmoji: "😀",
					  creatorAddress: tokenInfo.creator,
					  address: tokenInfo.tokenAddress,
					  image: tokenDetails.imageUrl,
					  website: tokenDetails.website,
					  telegram: tokenDetails.telegram,
					  twitter: tokenDetails.twitter,
					  creationTime: tokenInfo.creationTime,
					  lastUpdated: tokenInfo.lastUpdated,
					  status: tokenInfo.status,
				  };
			  } catch (error) {
				  console.error(`Error processing token ${tokenInfo.name}:`, error);
				  return null;
			  }
		  });
  
		  const tokenArray = await Promise.all(tokenPromises);
		  const validTokens = tokenArray.filter((token) => token !== null);
  
		  setTokens(validTokens);
		  setFilteredTokens(validTokens);
	  } catch (error) {
		  console.error("Error loading tokens:", error);
	  } finally {
		  setIsLoading(false);
	  }
  }, [calculateMarketCap]);
  

  // Memoized function to apply filters
  const applyFilters = useCallback(() => {
    const { searchValue, sortBy, sortOrder, status } = filters;

    let filtered = tokens;

    if (searchValue) {
      filtered = filtered.filter((token) =>
        token.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((token) => token.status === status);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "marketCap") {
        comparison =
          parseFloat(a.marketCap.replace(/[^0-9.-]+/g, "")) -
          parseFloat(b.marketCap.replace(/[^0-9.-]+/g, ""));
      } else if (sortBy === "creationTime") {
        comparison = new Date(a.creationTime) - new Date(b.creationTime);
      } else if (sortBy === "recentUpdates") {
        comparison = new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTokens(filtered);
  }, [filters, tokens]);

  useEffect(() => {
    loadTokens();
    const updateTokensPerPage = () => {
      if (window.innerWidth < 768) {
        setTokensPerPage(3);
      } else {
        setTokensPerPage(6);
      }
    };

    updateTokensPerPage();
    window.addEventListener("resize", updateTokensPerPage);

    return () => window.removeEventListener("resize", updateTokensPerPage);
  }, [loadTokens]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  // Memoized function for handling filter changes
  const handleFilterChange = useCallback((filterValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterValues,
    }));
  }, []);

  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = filteredTokens.slice(
    indexOfFirstToken,
    indexOfLastToken
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (token) => {
    navigate("/token-info", {
      state: { tokenName: token.name, tokenAddress: token.address },
    });
  };

  return (
    <>
      <div className="p-4 px-18 md:p-6 lg:p-18 ml-12 flex-grow overflow-auto heading1">
        <TokenFilters onFilterChange={handleFilterChange} />
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div
              id="tokenList"
              className="grid mt-10 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {currentTokens.map((token, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(token)}
                  className="cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  <Card
                    name={token.name}
                    symbol={token.symbol}
                    marketCap={token.marketCap}
                    remaining={token.remaining}
                    creatorEmoji={token.creatorEmoji}
                    creatorAddress={token.creatorAddress}
                    website={token.website}
                    telegram={token.telegram}
                    twitter={token.twitter}
                    address={token.address}
                    image={token.image}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 mt-5">
              <Pagination
                tokensPerPage={tokensPerPage}
                totalTokens={filteredTokens.length}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </>
        )}
        <footer className="relative bottom-0 left-0 right-0 text-center p-2 bg-transparent text-white text-xs">
          <span>© 2024 Memehome. All rights reserved</span>
        </footer>
      </div>
    </>
  );
};

export default Home;
