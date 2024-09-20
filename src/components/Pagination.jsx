import { useState } from "react";

const Pagination = ({
  tokensPerPage,
  totalTokens,
  currentPage,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(totalTokens / tokensPerPage);
  const pageNumbers = [];
  const maxVisiblePages = 5; // Adjust this number to show more intermediate pages if needed

  const getVisiblePages = () => {
    const visiblePages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if the total is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push(1, 2); // Always show the first two pages

      if (currentPage > 3 && currentPage < totalPages - 2) {
        visiblePages.push(currentPage - 1, currentPage, currentPage + 1); // Show pages around the current page
      } else if (currentPage <= 3) {
        visiblePages.push(3, 4); // Near the beginning
      } else {
        visiblePages.push(totalPages - 3, totalPages - 2); // Near the end
      }

      visiblePages.push(totalPages - 1, totalPages); // Always show the last two pages
    }

    return visiblePages;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex justify-center items-center">
      <ul className="pagination flex space-x-2">
        {/* Previous arrow */}
        <li
          className={`cursor-pointer px-3 py-1 rounded-lg ${
            currentPage === 1 ? "cursor-not-allowed text-gray-400" : "bg-gray-200 text-gray-700"
          }`}
        >
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </button>
        </li>

        {/* Page numbers */}
        {visiblePages.map((number) => (
          <li
            key={number}
            className={`cursor-pointer px-3 py-1 rounded-lg ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <button onClick={() => handlePageChange(number)}>{number}</button>
          </li>
        ))}

        {/* Next arrow */}
        <li
          className={`cursor-pointer px-3 py-1 rounded-lg ${
            currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "bg-gray-200 text-gray-700"
          }`}
        >
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
