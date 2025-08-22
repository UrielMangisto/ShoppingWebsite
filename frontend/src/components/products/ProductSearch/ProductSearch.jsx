import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useDebounce } from '../../../hooks/useDebounce';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatters';

const ProductSearch = ({ onSearch, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { searchProducts } = useProducts();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.trim()) {
        setLoading(true);
        try {
          const searchResults = await searchProducts(debouncedSearchTerm);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        }
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleResultClick = (productId) => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {results.length === 0 ? (
              <li className="relative cursor-default select-none py-2 px-3 text-gray-500">
                {loading ? 'Searching...' : 'No products found'}
              </li>
            ) : (
              results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    className="flex items-center px-4 py-2 hover:bg-gray-50"
                    onClick={() => handleResultClick(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    {product.inStock ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-600">Out of Stock</span>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
