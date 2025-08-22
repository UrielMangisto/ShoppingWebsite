// src/components/cart/CartItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  loading = false 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setLocalQuantity(newQuantity);
    
    const result = await onUpdateQuantity(item.id, newQuantity);
    
    if (!result.success) {
      // אם נכשל, החזר לכמות הקודמת
      setLocalQuantity(item.quantity);
    }
    
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (window.confirm('האם אתה בטוח שברצונך להסיר את הפריט מהעגלה?')) {
      await onRemoveItem(item.id);
    }
  };

  const isDisabled = loading || isUpdating;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="cart-item-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className="cart-item-image bg-gray-100 flex items-center justify-center text-gray-400 text-2xl"
          style={{ display: item.product.imageUrl ? 'none' : 'flex' }}
        >
          📦
        </div>
      </div>

      {/* Product Info */}
      <div className="cart-item-info">
        <div>
          <Link 
            to={`/products/${item.productId}`}
            className="cart-item-name hover:text-primary-600 transition-colors"
          >
            {item.product.name}
          </Link>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="cart-item-price">
              {formatPrice(item.product.price)}
            </div>
            
            <div className="text-sm text-gray-500">
              סה"כ: {formatPrice(item.subtotal)}
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="cart-item-controls block-mobile hidden-desktop">
          <div className="quantity-control">
            <button
              type="button"
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={isDisabled || localQuantity <= 1}
              className="quantity-button"
            >
              -
            </button>
            <input
              type="number"
              value={localQuantity}
              onChange={(e) => {
                const newQty = parseInt(e.target.value) || 1;
                if (newQty !== localQuantity) {
                  handleQuantityChange(newQty);
                }
              }}
              min="1"
              disabled={isDisabled}
              className="quantity-input"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={isDisabled}
              className="quantity-button"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isDisabled}
            className="btn btn-outline btn-sm text-error-600 border-error-300 hover:bg-error-50"
            title="הסר מהעגלה"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="cart-item-controls hidden-mobile flex-desktop">
        <div className="quantity-control">
          <button
            type="button"
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={isDisabled || localQuantity <= 1}
            className="quantity-button"
          >
            -
          </button>
          <input
            type="number"
            value={localQuantity}
            onChange={(e) => {
              const newQty = parseInt(e.target.value) || 1;
              if (newQty !== localQuantity) {
                handleQuantityChange(newQty);
              }
            }}
            min="1"
            disabled={isDisabled}
            className="quantity-input"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={isDisabled}
            className="quantity-button"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemove}
          disabled={isDisabled}
          className="btn btn-outline btn-sm text-error-600 border-error-300 hover:bg-error-50"
          title="הסר מהעגלה"
        >
          🗑️ הסר
        </button>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CartItem;