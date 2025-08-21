// src/components/cart/CartDropdown/CartDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import './CartDropdown.css';

const CartDropdown = () => {
  const { items, totalAmount, totalItems, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickRemove = async (itemId, itemName) => {
    if (window.confirm(`Remove ${itemName} from cart?`)) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated) {
    return (
      <Link to="/cart" className="cart-dropdown-trigger">
        <span className="cart-symbol">🛒</span>
        <span className="cart-text">Cart</span>
      </Link>
    );
  }

  return (
    <div className="cart-dropdown" ref={dropdownRef}>
      <button 
        className="cart-dropdown-trigger"
        onClick={toggleDropdown}
      >
        <div className="cart-icon-wrapper">
          <span className="cart-symbol">🛒</span>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </div>
        <span className="cart-text">Cart ({totalItems})</span>
      </button>

      {isOpen && (
        <div className="cart-dropdown-content">
          <div className="cart-dropdown-header">
            <h4>Shopping Cart</h4>
            <span className="items-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
          </div>

          <div className="cart-dropdown-body">
            {items.length === 0 ? (
              <div className="empty-cart-dropdown">
                <p>Your cart is empty</p>
                <Link 
                  to="/products" 
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items-preview">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="cart-item-preview">
                      <div className="item-preview-image">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} />
                        ) : (
                          <div className="no-image">📷</div>
                        )}
                      </div>
                      <div className="item-preview-info">
                        <div className="item-preview-name">{item.product.name}</div>
                        <div className="item-preview-details">
                          ${item.product.price} × {item.quantity}
                        </div>
                      </div>
                      <button
                        className="item-preview-remove"
                        onClick={() => handleQuickRemove(item.id, item.product.name)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {items.length > 3 && (
                    <div className="more-items">
                      +{items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="cart-dropdown-total">
                  <div className="total-row">
                    <span>Total: ${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="cart-dropdown-footer">
              <Link 
                to="/cart" 
                className="btn btn-secondary btn-full"
                onClick={() => setIsOpen(false)}
              >
                View Cart
              </Link>
              <Link 
                to="/checkout" 
                className="btn btn-primary btn-full"
                onClick={() => setIsOpen(false)}
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;