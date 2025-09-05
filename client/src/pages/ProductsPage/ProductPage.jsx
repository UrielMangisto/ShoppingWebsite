// src/pages/ProductsPage/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import ProductFilter from '../../components/products/ProductFilter/ProductFilter';
import { useProducts } from '../../context/ProductsContext';
import './ProductPage.css';

const ProductsPage = () => {
  const { 
    products, 
    loading, 
    loadMoreLoading,
    error, 
    filters, 
    sortBy, 
    setSortBy, 
    clearFilters, 
    fetchProducts,
    loadMoreProducts,
    hasMore
  } = useProducts();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products when filters or sorting change
  useEffect(() => {
    fetchProducts(true); // Reset pagination when filters or sorting change
  }, [filters, sortBy]);

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

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>All Products</h1>
          <p>Discover our amazing collection of products</p>
        </div>

        <div className="products-controls">
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

        <div className="products-content">
          <aside className={`filters-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
            <ProductFilter isLoading={loading} />
          </aside>

          <main className="products-main">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <h3>Error Loading Products</h3>
                <p>{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => fetchProducts(true)}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="products-info">
                  <span className="products-count">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
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
                    <div className="no-products">
                      <h3>No products found</h3>
                      <p>Try adjusting your filters or browse our categories.</p>
                      {getActiveFilterCount() > 0 && (
                        <button 
                          className="btn btn-primary"
                          onClick={clearFilters}
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Load More Button */}
                {products.length > 0 && hasMore && (
                  <div className="load-more-container">
                    <button 
                      className="btn btn-primary load-more-btn"
                      onClick={loadMoreProducts}
                      disabled={loadMoreLoading}
                    >
                      {loadMoreLoading ? (
                        <>
                          <div className="loading-spinner small"></div>
                          Loading more...
                        </>
                      ) : (
                        'Load More Products'
                      )}
                    </button>
                  </div>
                )}
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

export default ProductsPage;