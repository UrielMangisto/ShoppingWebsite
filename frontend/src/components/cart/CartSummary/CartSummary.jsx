import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils/formatters';
import { ROUTES } from '../../../utils/constants';

const CartSummary = () => {
  const navigate = useNavigate();
  const { total, items, subtotal, tax, shipping } = useCart();

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      
      {/* Summary Details */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-medium text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm font-medium text-gray-900">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Tax</span>
          <span className="text-sm font-medium text-gray-900">
            {formatPrice(tax)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-base font-medium text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6">
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Your order qualifies for free shipping
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Payment Methods */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 text-center">
          We accept
        </p>
        <div className="mt-2 flex justify-center space-x-2">
          <span className="sr-only">Visa</span>
          <svg className="h-8" viewBox="0 0 36 24" fill="none">
            <rect width="36" height="24" rx="4" fill="#E5E7EB"/>
            <path d="M10.5 8.5H13.5L15 17.5H12L10.5 8.5Z" fill="#4F46E5"/>
          </svg>

          <span className="sr-only">Mastercard</span>
          <svg className="h-8" viewBox="0 0 36 24" fill="none">
            <rect width="36" height="24" rx="4" fill="#E5E7EB"/>
            <circle cx="14" cy="12" r="5" fill="#EF4444"/>
            <circle cx="22" cy="12" r="5" fill="#F59E0B"/>
          </svg>

          <span className="sr-only">PayPal</span>
          <svg className="h-8" viewBox="0 0 36 24" fill="none">
            <rect width="36" height="24" rx="4" fill="#E5E7EB"/>
            <path d="M16 8.5C16 10.7091 14.2091 12.5 12 12.5C9.79086 12.5 8 10.7091 8 8.5C8 6.29086 9.79086 4.5 12 4.5C14.2091 4.5 16 6.29086 16 8.5Z" fill="#3B82F6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
