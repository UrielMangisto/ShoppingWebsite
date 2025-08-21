import React from 'react';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow ml-4">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.variant && `Variant: ${item.variant}`}
        </p>
        <div className="mt-1 text-sm text-gray-500">
          Price: {formatPrice(item.price)}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mx-4">
        <label htmlFor={`quantity-${item.id}`} className="sr-only">
          Quantity
        </label>
        <select
          id={`quantity-${item.id}`}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="rounded-md border-gray-300 py-1.5 text-base leading-5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={handleRemove}
        className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
