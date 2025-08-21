// src/components/products/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartSuccessMessage from '../../cart/CartSuccessMessage/CartSuccessMessage';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const imageUrl = product.image_url || null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setShowSuccess(true);
    } catch (error) {
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  const isOutOfStock = product.stock <= 0;
  const isAddingToCart = cartLoading;

  return (
    <>
      <div className="product-card">
        <Link to={`/products/${product.id}`} className="product-link">
          <div className="product-image">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name}
                className="product-img"
              />
            ) : (
              <div className="no-image">
                No Image
              </div>
            )}
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            {product.average_rating && parseFloat(product.average_rating) > 0 && (
              <div className="product-rating">
                <div className="rating-stars">
                  {renderStars(parseFloat(product.average_rating))}
                </div>
                <span className="rating-text">
                  ({product.review_count || 0} review{(product.review_count || 0) !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
        </Link>
        <div className="product-actions">
          <button 
            className="btn btn-primary add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
          >
            {isAddingToCart 
              ? 'Adding...' 
              : isOutOfStock 
                ? 'Out of Stock' 
                : 'Add to Cart'
            }
          </button>
        </div>
      </div>

      <CartSuccessMessage
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        productName={product.name}
        quantity={1}
      />
    </>
  );
};

export default ProductCard;