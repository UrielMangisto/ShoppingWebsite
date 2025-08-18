import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { ButtonSpinner } from '../common/Loading';
import './CartItem.css';

const CartItem = ({ item, className = '' }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }

    if (newQuantity === item.quantity) {
      return; // No change
    }

    try {
      setIsUpdating(true);
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove item
  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    try {
      setIsRemoving(true);
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing cart item:', error);
      setIsRemoving(false); // Reset on error
    }
  };

  // Handle quantity input change
  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      handleQuantityChange(value);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get image URL
  const getImageUrl = () => {
    if (imageError || !item.product?.image) {
      return '/placeholder-image.jpg';
    }
    return productService.getImageUrl(item.product.image);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate item total
  const itemTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className={`cart-item ${className} ${isRemoving ? 'removing' : ''}`}>
      <div className="cart-item-content">
        {/* Product Image */}
        <div className="cart-item-image">
          <Link to={`/products/${item.product_id}`}>
            <img
              src={getImageUrl()}
              alt={item.product_name || 'Product'}
              onError={handleImageError}
              loading="lazy"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="cart-item-info">
          <div className="product-details">
            <Link 
              to={`/products/${item.product_id}`}
              className="product-name-link"
            >
              <h3 className="product-name">
                {item.product_name || 'Unknown Product'}
              </h3>
            </Link>
            
            {item.product?.category && (
              <span className="product-category">
                {item.product.category}
              </span>
            )}

            <div className="product-price">
              <span className="unit-price">
                {formatPrice(item.price || 0)} each
              </span>
            </div>

            {/* Stock Status */}
            {item.product?.stock !== undefined && (
              <div className="stock-info">
                {item.product.stock > 0 ? (
                  <span className="in-stock">
                     In Stock ({item.product.stock} available)
                  </span>
                ) : (
                  <span className="out-of-stock">
                    L Out of Stock
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="cart-item-quantity">
          <label className="quantity-label">Quantity:</label>
          <div className="quantity-controls">
            <button
              onClick={() => handleQuantityChange((item.quantity || 1) - 1)}
              disabled={isUpdating || isRemoving || (item.quantity || 1) <= 1}
              className="quantity-btn decrease"
              aria-label="Decrease quantity"
            >
              
            </button>
            
            <input
              type="number"
              value={item.quantity || 1}
              onChange={handleQuantityInputChange}
              min="1"
              max={item.product?.stock || 999}
              disabled={isUpdating || isRemoving}
              className="quantity-input"
            />
            
            <button
              onClick={() => handleQuantityChange((item.quantity || 1) + 1)}
              disabled={
                isUpdating || 
                isRemoving || 
                (item.product?.stock && (item.quantity || 1) >= item.product.stock)
              }
              className="quantity-btn increase"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          {isUpdating && (
            <div className="updating-indicator">
              <ButtonSpinner size="small" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Item Total */}
        <div className="cart-item-total">
          <div className="total-label">Total:</div>
          <div className="total-price">
            {formatPrice(itemTotal)}
          </div>
        </div>

        {/* Remove Button */}
        <div className="cart-item-actions">
          <button
            onClick={handleRemove}
            disabled={isUpdating || isRemoving}
            className="remove-btn"
            aria-label={`Remove ${item.product_name} from cart`}
          >
            {isRemoving ? (
              <>
                <ButtonSpinner size="small" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <span className="remove-icon">=Ñ</span>
                <span>Remove</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Out of Stock Overlay */}
      {item.product?.stock === 0 && (
        <div className="out-of-stock-overlay">
          <div className="out-of-stock-message">
            <span className="warning-icon"> </span>
            <span>This item is currently out of stock</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;