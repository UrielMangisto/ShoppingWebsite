// src/pages/SearchResultsPage/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import ProductFilter from '../../components/products/ProductFilter/ProductFilter';
import ProductRecommendations from '../../components/products/ProductRecommendations/ProductRecommendations';
import { useProducts } from '../../context/ProductsContext';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    products, 
    loading, 
    error, 
    filters, 
    sortBy, 
    setSortBy, 
    clearFilters, 
    searchProducts 
  } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      // Initial search with URL parameters
      performSearch(query);
    } else {
      navigate('/products');
    }
  }, [searchParams]);

  // Perform search when filters or sorting change
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [filters, sortBy]);

  const performSearch = async (query) => {
    try {
      await searchProducts(query, filters);
      updateURL(query);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const updateURL = (query) => {
    const params = new URLSearchParams();
    
    if (query && query.trim()) {
      params.set('q', query.trim());
    }
    
    if (sortBy !== 'name_asc') {
      params.set('sort', sortBy);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      params.set('category', filters.categories[0]);
    }
    
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      params.set('minPrice', filters.minPrice);
    }
    
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      params.set('maxPrice', filters.maxPrice);
    }
    
    if (filters.minRating !== null && filters.minRating !== undefined) {
      params.set('minRating', filters.minRating);
    }
    

    
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories?.length > 0) count++;
    if (filters.minPrice !== null && filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) count++;
    if (filters.minRating !== null && filters.minRating !== undefined) count++;
    return count;
  };

  if (!searchTerm.trim()) {
    return null;
  }

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/products">Products</Link> / Search Results
          </div>
          <h1>Search Results</h1>
          <p>Results for "<strong>{searchTerm}</strong>"</p>
        </div>

        <div className="search-controls">
          <div className="sort-and-filter-controls">
            <div className="sort-controls">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="created_desc">Newest</option>
              </select>
            </div>

            <button 
              className="mobile-filter-toggle"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </button>
          </div>
        </div>

        <div className="search-content">
          <aside className={`filters-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
            <ProductFilter isLoading={loading} />
          </aside>

          <main className="search-main">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching products...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <h3>Search Error</h3>
                <p>{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => performSearch(searchTerm)}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="search-info">
                  <span className="results-count">
                    {products.length} result{products.length !== 1 ? 's' : ''} found
                  </span>
                  {getActiveFilterCount() > 0 && (
                    <button 
                      className="clear-all-filters-mobile"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
                
                <div className="products-grid">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="no-results">
                      <h3>No results found</h3>
                      <p>No products match your search for "<strong>{searchTerm}</strong>"</p>
                      <div className="search-suggestions">
                        <p>Suggestions:</p>
                        <ul>
                          <li>Check your spelling</li>
                          <li>Use more general terms</li>
                          <li>Try different keywords</li>
                          <li>Use the global search to try a new search</li>
                        </ul>
                        {getActiveFilterCount() > 0 && (
                          <button 
                            className="btn btn-primary"
                            onClick={clearFilters}
                          >
                            Clear All Filters
                          </button>
                        )}
                        <Link to="/products" className="btn btn-primary">
                          Browse All Products
                        </Link>
                      </div>
                      
                      {/* Show recommendations when no search results */}
                      <ProductRecommendations
                        type="popular"
                        title="Popular Products You Might Like"
                        limit={4}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>

        {showMobileFilters && (
          <div 
            className="mobile-filter-overlay"
            onClick={() => setShowMobileFilters(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;