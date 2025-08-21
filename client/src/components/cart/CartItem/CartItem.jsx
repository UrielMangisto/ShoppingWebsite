// src/components/cart/CartItem/CartItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from your cart?')) {
      try {
        await removeFromCart(item.id);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const isDisabled = loading || isUpdating;

  return (
    <div className="cart-item">
      <div className="item-image">
        {item.product.imageUrl ? (
          <img src={item.product.imageUrl} alt={item.product.name} />
        ) : (
          <div className="no-image">📷</div>
        )}
      </div>

      <div className="item-details">
        <Link to={`/products/${item.productId}`} className="item-name">
          {item.product.name}
        </Link>
        <div className="item-price">
          ${item.product.price.toFixed(2)} each
        </div>
      </div>

      <div className="item-controls">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isDisabled || item.quantity <= 1}
          >
            −
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isDisabled}
          >
            +
          </button>
        </div>

        <div className="item-subtotal">
          ${item.subtotal.toFixed(2)}
        </div>

        <button
          className="remove-btn"
          onClick={handleRemove}
          disabled={isDisabled}
          title="Remove from cart"
        >
          🗑️
        </button>
      </div>

      {isUpdating && (
        <div className="updating-overlay">
          <div className="updating-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CartItem;