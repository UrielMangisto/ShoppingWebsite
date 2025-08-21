import { Link } from 'react-router-dom'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'
import { formatPrice } from '../../../utils/formatters'
import ImageDisplay from '../../common/ImageDisplay/ImageDisplay'
import Loading from '../../common/Loading/Loading'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth()

  if (!product) {
    return null
  }

  const handleAddToCart = async (e) => {
    e.preventDefault() // Prevent navigation when clicking the button
    e.stopPropagation()
    
    if (!isAuthenticated) {
      // Could redirect to login or show a message
      return
    }

    await addToCart(product.id, 1)
  }

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        {/* Product Image */}
        <div className="product-image-container">
          <ImageDisplay
            imageId={product.image_id}
            alt={product.name}
            size="medium"
            className="product-image"
          />
          
          {/* Stock badges */}
          {isOutOfStock && (
            <div className="stock-badge out-of-stock">Out of Stock</div>
          )}
          {isLowStock && (
            <div className="stock-badge low-stock">Only {product.stock} left</div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          {product.category && (
            <p className="product-category">{product.category}</p>
          )}
          
          <p className="product-description">
            {product.description && product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </p>
          
          <div className="product-price">
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="product-actions">
        {isAuthenticated ? (
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || isOutOfStock}
            className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
          >
            {cartLoading ? (
              <Loading size="small" message="" />
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>
        ) : (
          <Link to="/login" className="login-prompt-btn">
            Login to Buy
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProductCard