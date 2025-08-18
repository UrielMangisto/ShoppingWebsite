import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import Loading, { CardSkeleton } from '../common/Loading';
import './ProductList.css';

const ProductList = ({ 
  showFilters = true,
  showSearch = true,
  limit = null,
  className = '' 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    // Update filters from URL params
    setFilters({
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'newest',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || ''
    });
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = {
        ...filters,
        page: currentPage,
        limit: limit || productsPerPage
      };

      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const response = await productService.getProducts(queryParams);
      setProducts(response.data || []);
      setTotalProducts(response.total || response.data?.length || 0);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId) => {
    handleFilterChange({ category: categoryId });
  };

  const handleSortChange = (sortBy) => {
    handleFilterChange({ sortBy });
  };

  const handlePriceFilterChange = (priceMin, priceMax) => {
    handleFilterChange({ priceMin, priceMax });
  };

  const handleSearchChange = (search) => {
    handleFilterChange({ search });
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      search: '',
      sortBy: 'newest',
      priceMin: '',
      priceMax: ''
    });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = () => {
    return filters.category || filters.search || filters.priceMin || filters.priceMax;
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (error) {
    return (
      <div className="products-error">
        <div className="error-content">
          <h3>Unable to load products</h3>
          <p>{error}</p>
          <button onClick={loadProducts} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-list ${className}`}>
      <div className="product-list-container">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              {hasActiveFilters() && (
                <button onClick={clearAllFilters} className="clear-all-btn">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />

            {/* Price Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-filter">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange({ priceMin: e.target.value })}
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange({ priceMax: e.target.value })}
                    className="price-input"
                  />
                </div>
                <button
                  onClick={() => handlePriceFilterChange(filters.priceMin, filters.priceMax)}
                  className="apply-price-btn btn btn-outline btn-sm"
                >
                  Apply
                </button>
              </div>

              {/* Quick Price Ranges */}
              <div className="quick-price-ranges">
                <button
                  onClick={() => handlePriceFilterChange('', '25')}
                  className="price-range-btn"
                >
                  Under $25
                </button>
                <button
                  onClick={() => handlePriceFilterChange('25', '50')}
                  className="price-range-btn"
                >
                  $25 - $50
                </button>
                <button
                  onClick={() => handlePriceFilterChange('50', '100')}
                  className="price-range-btn"
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => handlePriceFilterChange('100', '')}
                  className="price-range-btn"
                >
                  Over $100
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="products-main">
          {/* Search and Sort Bar */}
          <div className="products-header">
            <div className="results-info">
              <h2 className="results-title">
                {filters.search ? (
                  <>Search results for "{filters.search}"</>
                ) : filters.category ? (
                  <>Products in selected category</>
                ) : (
                  <>All Products</>
                )}
              </h2>
              
              {!isLoading && (
                <p className="results-count">
                  Showing {products.length} of {totalProducts} products
                </p>
              )}
            </div>

            <div className="products-controls">
              {/* Search Input */}
              {showSearch && (
                <div className="search-control">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="search-input"
                  />
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters() && (
            <div className="active-filters">
              <span className="filters-label">Active filters:</span>
              <div className="filter-tags">
                {filters.category && (
                  <span className="filter-tag">
                    Category: {filters.category}
                    <button onClick={() => handleFilterChange({ category: '' })}></button>
                  </span>
                )}
                {filters.search && (
                  <span className="filter-tag">
                    Search: {filters.search}
                    <button onClick={() => handleFilterChange({ search: '' })}></button>
                  </span>
                )}
                {(filters.priceMin || filters.priceMax) && (
                  <span className="filter-tag">
                    Price: {filters.priceMin || '0'} - {filters.priceMax || ''}
                    <button onClick={() => handleFilterChange({ priceMin: '', priceMax: '' })}></button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="products-content">
            {isLoading ? (
              <CardSkeleton count={limit || productsPerPage} />
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {!limit && totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ê Previous
                    </button>
                    
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next í
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <div className="no-products-icon">=Ê</div>
                  <h3>No products found</h3>
                  <p>
                    {hasActiveFilters() ? (
                      <>
                        No products match your current filters. 
                        <button onClick={clearAllFilters} className="link-btn">
                          Clear filters
                        </button> to see all products.
                      </>
                    ) : (
                      'No products are currently available.'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;