import React, { useState } from "react";
import { BsTwitterX } from "react-icons/bs";
import { BiLogoTelegram } from "react-icons/bi";
import { BsGlobe } from "react-icons/bs";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Card = ({
  name,
  symbol,
  marketCap,
  remaining,
  creatorEmoji,
  creatorAddress,
  website,
  telegram,
  twitter,
  address,
  image,
}) => {
  const [showCreatorAddress, setShowCreatorAddress] = useState(false);

  const handleCopy = (text) => {
    console.log(`Copied: ${text}`);
  };

  const formatAddress = (addr) => {
    if (!addr) return "Address not available";
    return `${addr.slice(0, 3)}...${addr.slice(-3)}`;
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-800 border border-blue-500 rounded-lg p-4 shadow-lg hover:shadow-[0_0_20px_10px_rgba(0,120,255,0.5)] transition duration-300 ease-in-out">
      {/* Main token data */}
      <div className="flex flex-col md:flex-row">
        {/* Token image */}
         <div className="h-24 w-24 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <img
            className="h-full w-full rounded-md object-contain"
            src={image}
            alt="Token"
          />
        </div>
        {/* Token details */}
        <div className="flex-grow">
          <h3 className="text-sm md:text-md font-semibold text-white uppercase truncate">
            {name}
          </h3>
          <p className="text-xs md:text-[0.75rem] text-[#00BFFF]">
            Symbol: {symbol}
          </p>
          <p className="text-xs md:text-[0.75rem] text-[#00BFFF] truncate">
            Market Cap: {marketCap}
          </p>
          <p className="text-xs md:text-[0.75rem] text-gray-400 truncate">
            Remaining: {remaining}
          </p>
          <div className="text-xs md:text-sm text-gray-400 font-semibold mt-2">
            <div className="flex items-center mb-1">
              <p className="mr-2">Deployed by</p>
              <CopyToClipboard text={creatorAddress}>
                <button className="text-blue-400 hover:text-blue-600 text-sm cursor-pointer">
                  <i className="fa-solid fa-copy"></i>
                </button>
              </CopyToClipboard>
            </div>

            <div className="flex items-center text-xs md:text-sm text-blue-400 font-normal">
              <span
                className="mr-2 text-sm cursor-pointer relative"
                onClick={() => setShowCreatorAddress(!showCreatorAddress)}
              >
                {showCreatorAddress && (
                  <span className="absolute left-0 top-6 bg-gray-900 text-white rounded-lg p-2">
                    {formatAddress(creatorAddress)}
                    <CopyToClipboard text={creatorAddress}>
                      <button className="ml-2 text-gray-400 text-[0.5rem] hover:text-white">
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </CopyToClipboard>
                  </span>
                )}
              </span>
            </div>
            {/* <p className="mt-2">Token Address</p>
            <div className="flex items-center text-xs md:text-[0.5rem] text-gray-400 font-normal">
              <span className="text-blue-300">{formatAddress(address)}</span>
              <CopyToClipboard text={address}>
                <button className="ml-2 text-gray-400 text-[0.5rem]">
                  <i className="fa-solid fa-copy"></i>
                </button>
              </CopyToClipboard>
            </div> */}
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4">
        {/* Social media links */}
        <div className="flex space-x-2 md:space-x-4 text-gray-400 mb-4 md:mb-0">
          <a
            href={website}
            className="text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGlobe size={18} />
          </a>
          <a
            href={telegram}
            className="text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BiLogoTelegram size={18} />
          </a>
          <a
            href={twitter}
            className="text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX size={18} />
          </a>
        </div>
        {/* Network connection */}
        <div>
          <img
            className="h-5 w-5 md:h-5 md:w-5"
            src="/base.png"
            alt="Base Network"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
