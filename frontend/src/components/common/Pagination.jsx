// src/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5
}) => {
  // אם יש עמוד אחד או פחות, לא להציג עימוד
  if (totalPages <= 1) {
    return null;
  }

  // חישוב טווח העמודים להצגה
  const getVisiblePages = () => {
    const pages = [];
    const halfRange = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // התאמה אם אנחנו בתחילת או בסוף הרשימה
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // חישוב מידע על פריטים
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const PaginationButton = ({ 
    page, 
    isActive = false, 
    isDisabled = false, 
    children, 
    ariaLabel 
  }) => (
    <button
      onClick={() => handlePageClick(page)}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={`
        pagination-button
        ${isActive ? 'active' : ''}
        ${isDisabled ? 'disabled' : ''}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Info */}
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          מציג {startItem}-{endItem} מתוך {totalItems} מוצרים
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="pagination" role="navigation" aria-label="עימוד">
        {/* First Page */}
        {currentPage > 2 && (
          <PaginationButton
            page={1}
            isDisabled={isFirstPage}
            ariaLabel="עמוד ראשון"
          >
            ⏮️
          </PaginationButton>
        )}

        {/* Previous Page */}
        <PaginationButton
          page={currentPage - 1}
          isDisabled={isFirstPage}
          ariaLabel="עמוד קודם"
        >
          ◀️
        </PaginationButton>

        {/* Page Numbers */}
        {visiblePages[0] > 1 && (
          <>
            <PaginationButton page={1} ariaLabel="עמוד 1">
              1
            </PaginationButton>
            {visiblePages[0] > 2 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            isActive={page === currentPage}
            ariaLabel={`עמוד ${page}`}
          >
            {page}
          </PaginationButton>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
            <PaginationButton 
              page={totalPages} 
              ariaLabel={`עמוד ${totalPages}`}
            >
              {totalPages}
            </PaginationButton>
          </>
        )}

        {/* Next Page */}
        <PaginationButton
          page={currentPage + 1}
          isDisabled={isLastPage}
          ariaLabel="עמוד הבא"
        >
          ▶️
        </PaginationButton>

        {/* Last Page */}
        {currentPage < totalPages - 1 && (
          <PaginationButton
            page={totalPages}
            isDisabled={isLastPage}
            ariaLabel="עמוד אחרון"
          >
            ⏭️
          </PaginationButton>
        )}
      </nav>

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">קפוץ לעמוד:</span>
          <select
            value={currentPage}
            onChange={(e) => handlePageClick(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// רכיב עימוד פשוט יותר
export const SimplePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPageNumbers = false 
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="btn btn-outline btn-sm"
      >
        ← קודם
      </button>

      {showPageNumbers && (
        <span className="text-sm text-gray-600">
          עמוד {currentPage} מתוך {totalPages}
        </span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="btn btn-outline btn-sm"
      >
        הבא →
      </button>
    </div>
  );
};

// Hook לניהול עימוד
export const usePagination = (totalItems, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  // איפוס עמוד כאשר משתנה מספר הפריטים
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

export default Pagination;