import React, { useState, useEffect } from 'react';

const TokenFilters = ({ onFilterChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('creationTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('all');
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Notify parent component of filter changes
    onFilterChange({ searchValue, sortBy, sortOrder, status, animationsEnabled });
  }, [searchValue, sortBy, sortOrder, status, animationsEnabled, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row items-center mt-2 justify-center">
      <span className="mr-2 font-semibold mt-2 hidden md:inline-block">Real Time Pairs:</span>
      
      {/* Search Bar */}
      <div className="flex flex-row justify-between w-2/3 md:w-auto">
        <input
          className="p-1 text-white bg-gray-950 rounded-lg px-3 py-2 w-full md:w-80"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by token"
        />
      </div>
      
      {/* Sorting Options - Only visible on medium and larger screens */}
      <div className="hidden md:flex flex-row ml-5 gap-5">
        <select
          className="px-4 py-3 bg-gray-950 text-white rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="creationTime">Creation Time</option>
          <option value="recentApes">Recent Apes</option>
          <option value="marketCap">Market Cap</option>
        </select>

        <select
          className="px-4 py-3 ml-2 bg-gray-950 text-white rounded-lg"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default TokenFilters;
