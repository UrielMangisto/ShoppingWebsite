import React from 'react';
import CartItem from '../CartItem/CartItem';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils/formatters';

const CartList = () => {
  const { items, loading, error, total } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-medium text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
        <p className="mt-1 text-sm text-gray-500">{items.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="px-6">
            <CartItem item={item} />
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900">Subtotal</span>
          <span className="text-xl font-semibold text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Shipping and taxes calculated at checkout
        </p>
      </div>
    </div>
  );
};

export default CartList;
