import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { ButtonSpinner } from '../common/Loading';
import './ProductCard.css';

const ProductCard = ({ product, showAddToCart = true, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event bubbling

    if (!isAuthenticated) {
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        // Optional: Show success feedback
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Get image URL
  const getImageUrl = () => {
    if (imageError || !product.image) {
      return '/placeholder-image.jpg'; // You can add a placeholder image to public folder
    }
    return productService.getImageUrl(product.image);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Check if product is in stock
  const isInStock = product.stock > 0;
  const currentQuantityInCart = getItemQuantity(product.id);
  const isProductInCart = isInCart(product.id);

  return (
    <div className={`product-card ${className} ${!isInStock ? 'out-of-stock' : ''}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        {/* Product Image */}
        <div className="product-image-container">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Stock Badge */}
          {!isInStock && (
            <div className="stock-badge out-of-stock-badge">
              Out of Stock
            </div>
          )}
          
          {/* Sale Badge (if you add sale functionality later) */}
          {product.sale && (
            <div className="stock-badge sale-badge">
              Sale
            </div>
          )}
          
          {/* In Cart Indicator */}
          {isProductInCart && (
            <div className="cart-indicator">
              <span className="cart-icon">🛒</span>
              <span className="cart-count">{currentQuantityInCart}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-category">
            {product.category || 'General'}
          </div>
          
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
          
          <p className="product-description" title={product.description}>
            {product.description}
          </p>
          
          <div className="product-price">
            <span className="current-price">
              {formatPrice(product.price)}
            </span>
            {/* Original price if on sale */}
            {product.originalPrice && (
              <span className="original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="product-stock">
            {isInStock ? (
              <span className="stock-info in-stock">
                📦 {product.stock} in stock
              </span>
            ) : (
              <span className="stock-info out-of-stock">
                ❌ Out of stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {showAddToCart && isAuthenticated && (
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock || isAddingToCart}
            className={`add-to-cart-btn ${isProductInCart ? 'in-cart' : ''}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddingToCart ? (
              <>
                <ButtonSpinner size="small" />
                Adding...
              </>
            ) : isProductInCart ? (
              <>
                <span className="cart-icon">✓</span>
                In Cart ({currentQuantityInCart})
              </>
            ) : (
              <>
                <span className="cart-icon">🛒</span>
                Add to Cart
              </>
            )}
          </button>
        </div>
      )}

      {/* Login Prompt for Unauthenticated Users */}
      {showAddToCart && !isAuthenticated && (
        <div className="product-actions">
          <Link to="/login" className="login-prompt-btn">
            Login to Add to Cart
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;