import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = ''
}) => {
  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const generatePaginationItems = () => {
    // Always show first page
    const items = [1];

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - siblingCount);
    const rangeEnd = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add dots if there's a gap after first page
    if (rangeStart > 2) {
      items.push('...');
    }

    // Add pages around current page
    items.push(...range(rangeStart, rangeEnd));

    // Add dots if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      items.push('...');
    }

    // Add last page if we have more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  if (totalPages <= 1) return null;

  const items = generatePaginationItems();

  return (
    <nav className={`flex items-center justify-center ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 ${
          currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-500'
        }`}
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex -space-x-px">
        {items.map((item, index) => {
          if (item === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                currentPage === item
                  ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 ${
          currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-500'
        }`}
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
