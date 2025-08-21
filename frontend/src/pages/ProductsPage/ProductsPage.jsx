import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productsService } from '../../services/productsService'
import { categoriesService } from '../../services/categoriesService'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Get query parameters
        const categoryId = searchParams.get('category') || ''
        const search = searchParams.get('q') || ''
        const page = parseInt(searchParams.get('page')) || 1
        const sort = searchParams.get('sort') || 'latest'
        
        // Set initial filter states
        setSelectedCategory(categoryId)
        setSortBy(sort)
        setCurrentPage(page)

        // Fetch categories
        const categoriesData = await categoriesService.getCategories()
        setCategories(categoriesData)

        // Prepare query params
        const params = {
          page,
          sort,
          ...(categoryId && { category: categoryId }),
          ...(search && { q: search }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max })
        }

        // Fetch products
        const data = search ? 
          await productsService.search(search) : 
          await productsService.getAllProducts(params)

        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message || 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const handleCategoryChange = (categoryId) => {
    const params = new URLSearchParams(searchParams)
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    params.set('page', '1')
    navigate({ search: params.toString() })
  }

  const handleSortChange = (sort) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    params.set('page', '1')
    navigate({ search: params.toString() })
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    navigate({ search: params.toString() })
  }

  const handlePriceRangeSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (priceRange.min) params.set('minPrice', priceRange.min)
    if (priceRange.max) params.set('maxPrice', priceRange.max)
    params.set('page', '1')
    navigate({ search: params.toString() })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filters-panel">
              <h2 className="filter-title">Filters</h2>
            
              {/* Categories Filter */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Categories</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Price Range</h3>
                <form onSubmit={handlePriceRangeSubmit} className="price-range-form">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="form-input"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Sort Options */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="form-select"
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid-container">
            {products.length === 0 ? (
              <div className="empty-state">
                <p>No products found</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="product-card"
                  >
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="btn btn-primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-button ${
                      currentPage === page
                        ? 'pagination-button-active'
                        : 'pagination-button-inactive'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
