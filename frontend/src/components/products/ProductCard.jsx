// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, truncateText } from '../../utils/helpers';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // מניעת ניווט לדף המוצר
    e.stopPropagation();

    if (!isAuthenticated) {
      // אפשר להוסיף הודעה או להפנות להתחברות
      return;
    }

    const result = await addToCart(product.id, 1);
    
    if (result.success && onAddToCart) {
      onAddToCart(product);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star">⭐</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="star">⭐</span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">☆</span>
        );
      }
    }

    return stars;
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card group">
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Placeholder אם אין תמונה */}
          <div 
            className="product-image-placeholder"
            style={{ display: product.image_url ? 'none' : 'flex' }}
          >
            📦
          </div>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-error-500 text-white px-2 py-1 rounded text-xs font-semibold">
              אזל מהמלאי
            </div>
          )}

          {/* New Badge */}
          {product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 left-2 bg-success-500 text-white px-2 py-1 rounded text-xs font-semibold">
              חדש
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name" title={product.name}>
            {truncateText(product.name, 50)}
          </h3>

          {product.description && (
            <p className="product-description" title={product.description}>
              {truncateText(product.description, 80)}
            </p>
          )}

          <div className="product-price">
            {formatPrice(product.price)}
          </div>

          {/* Rating */}
          {product.average_rating && product.review_count > 0 && (
            <div className="product-rating">
              <div className="rating-stars">
                {renderStars(product.average_rating)}
              </div>
              <span className="rating-text">
                ({product.review_count} ביקורות)
              </span>
            </div>
          )}

          {/* Category */}
          {product.category_name && (
            <div className="text-sm text-gray-500 mb-3">
              📂 {product.category_name}
            </div>
          )}

          {/* Stock Info */}
          <div className="text-sm mb-4">
            {isOutOfStock ? (
              <span className="text-error-600 font-medium">אזל מהמלאי</span>
            ) : product.stock < 10 ? (
              <span className="text-warning-600">
                נותרו {product.stock} במלאי
              </span>
            ) : (
              <span className="text-success-600">במלאי</span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="product-actions">
          <Link 
            to={`/products/${product.id}`}
            className="btn btn-outline flex-1"
          >
            צפה בפרטים
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
              className={`btn flex-1 ${
                isOutOfStock 
                  ? 'btn-secondary cursor-not-allowed' 
                  : 'btn-primary'
              }`}
              title={
                !isAuthenticated 
                  ? 'התחבר כדי להוסיף לעגלה'
                  : isOutOfStock 
                  ? 'המוצר לא במלאי'
                  : 'הוסף לעגלה'
              }
            >
              {cartLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  מוסיף...
                </span>
              ) : isOutOfStock ? (
                'לא במלאי'
              ) : (
                '🛒 הוסף לעגלה'
              )}
            </button>
          )}
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            <Link to="/login" className="text-primary-600 hover:underline">
              התחבר
            </Link>
            {' '}כדי להוסיף לעגלה
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;