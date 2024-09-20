import  { useState, useEffect } from "react";
import "../pages/Home/home.css";

// Function to format the time difference
const formatTimeDifference = (timestamp) => {
	const timestampInSeconds = new Date(timestamp).getTime() / 1000;
	const currentTimeInSeconds = Math.floor(Date.now() / 1000);
	const timeDifferenceInSeconds = currentTimeInSeconds - timestampInSeconds;

	const minutes = Math.floor(timeDifferenceInSeconds / 60);
	const seconds = (timeDifferenceInSeconds % 60).toFixed(1);

	return `${minutes}m ${seconds}s ago`;
};

const TransactionTable = ({ tokenName }) => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await fetch(
					`https://memhome-server-iota.vercel.app/api/transactions?tokenName=${tokenName}`
				);
				if (!response.ok) {
					if (response.status === 404) {
						const errorData = await response.json();
						setError(errorData.message); // Set error message returned from the backend
						setTransactions([]); // No transactions found
					} else {
						throw new Error(`Error: ${response.status}`);
					}
					setLoading(false);
				} else {
					const data = await response.json();
					setTransactions(data);
					setLoading(false);
				}
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchTransactions(); // Fetch initially
		const intervalId = setInterval(fetchTransactions, 2000); // Auto-refresh every 2 seconds

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, [tokenName]);

	// If still loading, show the spinner
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-black ">
				<div
					className="animate-spin inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	}

	// If there's an error, display the error message
	if (error) {
		return (
			<div className="text-center text-blue bg-none p-4 heading1">{error}</div>
		);
	}

	// If no transactions found, show a message
	if (transactions.length === 0) {
		return (
			<div className="text-center text-gray-400 bg-black p-4">
				No trade Found
			</div>
		);
	}
	

	return (
		<div className ="overflow-x-auto w-[85vw] p-4 bg-black m-16 heading2">
			<h2 className="text-2xl font-bold text-sky-400 mb-4 border-b-2 border-blue-600 pb-2">
				Trade
			</h2>
			<div className="relative">
				<table className="w-full table-auto rounded-xl shadow-lg bg-blue-900 border border-blue-800">
					<thead>
						<tr className="bg-blue-800 text-sky-300 ">
							<th className="p-3 text-left">Type</th>
							<th className="p-3 text-left">User Address</th>
							<th className="p-3 text-left">Token Quantity</th>
							<th className="p-3 text-left">ETH Quantity</th>
							<th className="p-3 text-left">Transaction Hash</th>
							<th className="p-3 text-left">Timestamp</th>
						</tr>
					</thead>
					<tbody>
						{transactions.length === 0 ? (
							<tr>
								<td colSpan="6" className="text-center text-gray-400 p-4">
									No transactions found for {tokenName}
								</td>
							</tr>
						) : (
							transactions.map((transaction) => (
								<tr
									key={transaction._id}
									className="bg-black hover:bg-blue-800 transition-all duration-300 "
								>
									<td className="p-3">{transaction.type}</td>
									<td className="p-3">{transaction.userAddress}</td>
									<td className="p-3">{transaction.tokenQuantity}</td>
									<td className="p-3">{transaction.ethQuantity}</td>
									<td className="p-3 truncate relative text-sky-300">
										<a
											href={`https://sepolia.basescan.org/tx/${transaction.txHash}`}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:underline"
										>
											{transaction.txHash.length > 20
												? `${transaction.txHash.slice(0, 40)}...`
												: transaction.txHash}
										</a>
										<div className="absolute left-0 hidden group-hover:block bg-blue-800 text-sky-300 rounded-lg p-2 shadow-lg">
											{`https://sepolia.basescan.org/tx/${transaction.txHash}`}
										</div>
									</td>
									<td className="p-3 truncate relative group text-sky-300">
										<span>{formatTimeDifference(transaction.timestamp)}</span>
										<div className="absolute left-0 hidden bg-blue-800 text-sky-300  rounded-lg p-2 shadow-lg group-hover:block">
											{formatTimeDifference(transaction.timestamp)}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TransactionTable;
