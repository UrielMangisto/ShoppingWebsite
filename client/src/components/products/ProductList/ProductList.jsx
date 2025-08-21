import { useState } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import Loading from '../../common/Loading/Loading'
import './ProductList.css'

const ProductList = ({ 
  products = [], 
  loading = false, 
  error = null,
  showViewToggle = true,
  showSort = true,
  emptyMessage = "No products found",
  className = ""
}) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('default') // 'default', 'price_asc', 'price_desc', 'name'

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.price || 0) - (b.price || 0)
      case 'price_desc':
        return (b.price || 0) - (a.price || 0)
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      default:
        return 0
    }
  })

  // Loading state
  if (loading) {
    return (
      <div className="product-list-loading">
        <Loading size="large" message="Loading products..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="product-list-error">
        <div className="error-content">
          <span className="error-icon">❌</span>
          <h3 className="error-title">Unable to load products</h3>
          <p className="error-message">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <div className="empty-content">
          <span className="empty-icon">📦</span>
          <h3 className="empty-title">No Products Available</h3>
          <p className="empty-message">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`product-list ${className}`}>
      {/* Controls */}
      {(showViewToggle || showSort) && (
        <div className="product-list-controls">
          <div className="controls-left">
            <span className="product-count">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="controls-right">
            {/* Sort dropdown */}
            {showSort && (
              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Default</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            )}

            {/* View toggle */}
            {showViewToggle && (
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  aria-label="Grid view"
                >
                  <span className="view-icon">⚏</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  aria-label="List view"
                >
                  <span className="view-icon">☰</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products grid/list */}
      <div className={`products-container ${viewMode}-view`}>
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className={viewMode === 'list' ? 'list-view' : ''}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList