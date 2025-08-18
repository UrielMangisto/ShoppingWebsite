import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);

  // Update query when URL search params change
  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    setQuery(searchQuery);
  }, [searchParams]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle search execution
  const handleSearch = () => {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length === 0) {
      // If empty, go to products page without search
      navigate('/products');
    } else {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }

    // Call onSearch callback if provided (for mobile menu close)
    if (onSearch) {
      onSearch();
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    navigate('/products');
    
    if (onSearch) {
      onSearch();
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="search-input"
            disabled={isLoading}
          />
          
          {/* Clear button - show when there's text */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          
          {/* Search button */}
          <button
            type="submit"
            className="search-submit-btn"
            disabled={isLoading}
            aria-label="Search"
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <span className="search-icon">🔍</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick search suggestions (could be enhanced later) */}
      {query.length > 0 && (
        <div className="search-suggestions">
          {/* This could be enhanced with actual search suggestions from API */}
        </div>
      )}
    </div>
  );
};

export default SearchBar;