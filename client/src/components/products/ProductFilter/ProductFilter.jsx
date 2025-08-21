import { useState, useEffect } from 'react'
import { getCategories } from '../../../services/categoriesService'
import Loading from '../../common/Loading/Loading'
import './ProductFilter.css'

const ProductFilter = ({ 
  onFilterChange, 
  initialFilters = {},
  showPriceFilter = true,
  showCategoryFilter = true,
  showStockFilter = true,
  className = ""
}) => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false,
    ...initialFilters
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    if (showCategoryFilter) {
      fetchCategories()
    }
  }, [showCategoryFilter])

  // Notify parent when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }, [filters, onFilterChange])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const handlePriceChange = (field, value) => {
    // Validate price input
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      handleFilterChange(field, value)
    }
  }

  const clearAllFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    })
  }

  const hasActiveFilters = () => {
    return filters.category || filters.minPrice || filters.maxPrice || filters.inStockOnly
  }

  return (
    <div className={`product-filter ${className}`}>
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <div className="filter-actions">
          {hasActiveFilters() && (
            <button 
              onClick={clearAllFilters}
              className="clear-filters-btn"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="toggle-filters-btn"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </button>
        </div>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Category Filter */}
        {showCategoryFilter && (
          <div className="filter-group">
            <label htmlFor="category-filter" className="filter-label">
              Category
            </label>
            {loadingCategories ? (
              <div className="filter-loading">
                <Loading size="small" message="" />
              </div>
            ) : (
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Price Filter */}
        {showPriceFilter && (
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-range">
              <div className="price-input-group">
                <label htmlFor="min-price" className="sr-only">Minimum price</label>
                <input
                  type="number"
                  id="min-price"
                  placeholder="Min $"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="price-input"
                  min="0"
                  step="0.01"
                />
              </div>
              <span className="price-separator">to</span>
              <div className="price-input-group">
                <label htmlFor="max-price" className="sr-only">Maximum price</label>
                <input
                  type="number"
                  id="max-price"
                  placeholder="Max $"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="price-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stock Filter */}
        {showStockFilter && (
          <div className="filter-group">
            <label className="filter-checkbox-container">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                className="filter-checkbox"
              />
              <span className="checkbox-label">In stock only</span>
            </label>
          </div>
        )}

        {/* Active filters summary */}
        {hasActiveFilters() && (
          <div className="active-filters">
            <h4 className="active-filters-title">Active Filters:</h4>
            <div className="filter-tags">
              {filters.category && (
                <span className="filter-tag">
                  Category: {categories.find(c => c.id.toString() === filters.category)?.name || filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="remove-filter-btn"
                    aria-label="Remove category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.minPrice && (
                <span className="filter-tag">
                  Min: ${filters.minPrice}
                  <button
                    onClick={() => handleFilterChange('minPrice', '')}
                    className="remove-filter-btn"
                    aria-label="Remove minimum price filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className="filter-tag">
                  Max: ${filters.maxPrice}
                  <button
                    onClick={() => handleFilterChange('maxPrice', '')}
                    className="remove-filter-btn"
                    aria-label="Remove maximum price filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.inStockOnly && (
                <span className="filter-tag">
                  In Stock Only
                  <button
                    onClick={() => handleFilterChange('inStockOnly', false)}
                    className="remove-filter-btn"
                    aria-label="Remove stock filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFilter