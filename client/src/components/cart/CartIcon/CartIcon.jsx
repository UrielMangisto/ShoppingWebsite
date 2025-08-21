// src/components/cart/CartIcon/CartIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import './CartIcon.css';

const CartIcon = () => {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <Link to="/cart" className="cart-icon">
      <div className="cart-icon-wrapper">
        <span className="cart-symbol">🛒</span>
        {isAuthenticated && totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </div>
      <span className="cart-text">
        Cart {isAuthenticated ? `(${totalItems || 0})` : ''}
      </span>
    </Link>
  );
};

export default CartIcon;