import Web3 from 'web3';

let web3;
let contract;

if (window.ethereum) {
	web3 = new Web3(window.ethereum);

    const contractABI =[
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "buyToken",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_symbol",
                    "type": "string"
                }
            ],
            "name": "createToken",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "uint128",
                    "name": "_amount",
                    "type": "uint128"
                }
            ],
            "name": "sellToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "tokenName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "amountEth",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint128",
                    "name": "amountTokens",
                    "type": "uint128"
                }
            ],
            "name": "TokenBoughtFromContract",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                }
            ],
            "name": "TokenCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "tokenName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint128",
                    "name": "amountTokens",
                    "type": "uint128"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "amountEth",
                    "type": "string"
                }
            ],
            "name": "TokenSoldToContract",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "baseTokenPriceWei",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "calculateTokenPrice",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenName",
                    "type": "string"
                }
            ],
            "name": "checkUserTokenBalance",
            "outputs": [
                {
                    "internalType": "uint128",
                    "name": "",
                    "type": "uint128"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "feePercentage",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "getRemainingTokensPercentage",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "listAllHolders",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                },
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "listAllTokens",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "symbol",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "uint128",
                            "name": "currentBalance",
                            "type": "uint128"
                        },
                        {
                            "internalType": "uint64",
                            "name": "currentPriceWei",
                            "type": "uint64"
                        }
                    ],
                    "internalType": "struct TokenMarketplace.TokenInfo[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "listTokenDetailsByName",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "symbol",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "uint128",
                            "name": "currentBalance",
                            "type": "uint128"
                        },
                        {
                            "internalType": "uint64",
                            "name": "currentPriceWei",
                            "type": "uint64"
                        }
                    ],
                    "internalType": "struct TokenMarketplace.TokenInfo",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "listTokens",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "listTokensCreatedByUser",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "symbol",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "uint128",
                            "name": "currentBalance",
                            "type": "uint128"
                        },
                        {
                            "internalType": "uint64",
                            "name": "currentPriceWei",
                            "type": "uint64"
                        }
                    ],
                    "internalType": "struct TokenMarketplace.TokenInfo[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "priceAdjustmentFactorWei",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contractAddress = '0xCCa004702D415a5c643A30b10E088cedE9421819';
	contract = new web3.eth.Contract(contractABI, contractAddress);
} else {
	console.error('No Ethereum provider found. Install MetaMask or another wallet.');
}

export { web3, contract };
