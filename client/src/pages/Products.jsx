import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import Loading, { CardSkeleton } from '../components/common/Loading';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name_asc',
  });

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Load initial data
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'name_asc',
    });
  }, [searchParams]);

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Load products
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setTotalProducts(response.data.length);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update filter and URL
  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name_asc',
    });
    setSearchParams({});
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get selected category name
  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === parseInt(filters.category));
    return category ? category.name : null;
  };

  // Sort options
  const sortOptions = [
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
  ];

  // Price ranges for quick filters
  const priceRanges = [
    { min: 0, max: 25, label: 'Under $25' },
    { min: 25, max: 50, label: '$25 - $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: '', label: 'Over $200' },
  ];

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-header">
          <button 
            onClick={toggleSidebar} 
            className="filter-toggle-btn"
            aria-label="Toggle filters"
          >
            🔍 Filters
          </button>
          <div className="results-count">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`products-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button 
              onClick={toggleSidebar}
              className="sidebar-close"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-filters">
              <button
                onClick={() => updateFilter('category', '')}
                className={`category-btn ${!filters.category ? 'active' : ''}`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilter('category', category.id.toString())}
                  className={`category-btn ${filters.category === category.id.toString() ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range-filters">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    updateFilter('minPrice', range.min.toString());
                    updateFilter('maxPrice', range.max.toString());
                  }}
                  className={`price-range-btn ${
                    filters.minPrice === range.min.toString() && 
                    filters.maxPrice === range.max.toString() ? 'active' : ''
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="custom-price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Page Header */}
          <div className="products-header">
            <div className="page-title-section">
              <h1>
                {filters.search ? (
                  <>Search results for "{filters.search}"</>
                ) : getSelectedCategoryName() ? (
                  <>{getSelectedCategoryName()}</>
                ) : (
                  'All Products'
                )}
              </h1>
              <p className="results-info">
                {isLoading ? (
                  'Loading products...'
                ) : (
                  `${totalProducts} ${totalProducts === 1 ? 'product' : 'products'} found`
                )}
              </p>
            </div>

            <div className="products-controls">
              {/* Sort Dropdown */}
              <div className="sort-control">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  aria-label="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
            <div className="active-filters">
              <h4>Active Filters:</h4>
              <div className="filter-tags">
                {filters.search && (
                  <span className="filter-tag">
                    Search: "{filters.search}"
                    <button onClick={() => updateFilter('search', '')}>✕</button>
                  </span>
                )}
                {filters.category && (
                  <span className="filter-tag">
                    Category: {getSelectedCategoryName()}
                    <button onClick={() => updateFilter('category', '')}>✕</button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="filter-tag">
                    Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button onClick={() => {
                      updateFilter('minPrice', '');
                      updateFilter('maxPrice', '');
                    }}>✕</button>
                  </span>
                )}
                <button onClick={clearFilters} className="clear-all-tag">
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {error ? (
            <div className="error-container">
              <h3 className="error-title">Something went wrong</h3>
              <p className="error-message">{error}</p>
              <button onClick={loadProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <CardSkeleton count={12} />
          ) : products.length > 0 ? (
            <div className={`products-grid ${viewMode}`}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'list-view' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-description">
                {filters.search || filters.category || filters.minPrice || filters.maxPrice ? (
                  <>
                    No products match your current filters. 
                    Try adjusting your search criteria.
                  </>
                ) : (
                  'No products are available at the moment. Please check back later.'
                )}
              </p>
              {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Load More / Pagination (Future Enhancement) */}
          {products.length > 0 && !isLoading && (
            <div className="pagination-container">
              <p className="pagination-info">
                Showing {products.length} of {totalProducts} products
              </p>
              {/* Future: Add pagination buttons here */}
            </div>
          )}
        </main>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}
      </div>
    </div>
  );
};

export default Products;