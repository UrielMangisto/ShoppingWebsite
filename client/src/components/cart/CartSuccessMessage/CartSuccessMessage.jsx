// src/components/cart/CartSuccessMessage/CartSuccessMessage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartSuccessMessage.css';

const CartSuccessMessage = ({ 
  show, 
  onClose, 
  productName, 
  quantity = 1,
  autoHide = true,
  duration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, autoHide, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`cart-success-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`cart-success-message ${isVisible ? 'show' : ''}`}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="success-icon">
          <span className="checkmark">✓</span>
        </div>
        
        <div className="success-content">
          <h3>Added to Cart!</h3>
          <p>
            <strong>{productName}</strong>
            {quantity > 1 && <span> (×{quantity})</span>}
          </p>
        </div>
        
        <div className="success-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Continue Shopping
          </button>
          <Link to="/cart" className="btn btn-primary">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSuccessMessage;