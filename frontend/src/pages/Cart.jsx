// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { formatPrice } from '../utils/helpers';
import CartItem from '../components/cart/CartItem';
import Loading from '../components/common/Loading';

const Cart = () => {
  const { 
    cart, 
    loading: cartLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleUpdateQuantity = async (itemId, quantity) => {
    return await updateCartItem(itemId, quantity);
  };

  const handleRemoveItem = async (itemId) => {
    return await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('האם אתה בטוח שברצונך לנקות את כל העגלה?')) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    setIsProcessingOrder(true);
    
    try {
      const result = await createOrder();
      
      if (result.success) {
        // ניקוי העגלה
        clearCart();
        
        // הודעת הצלחה והפנייה לדף ההזמנות
        alert('ההזמנה בוצעה בהצלחה!');
        navigate('/orders');
      } else {
        alert(`שגיאה ביצירת הזמנה: ${result.error}`);
      }
    } catch (error) {
      alert('שגיאה לא צפויה. אנא נסה שוב.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const calculateSavings = () => {
    // חישוב חסכון (אפשר להוסיף לוגיקה למבצעים)
    return 0;
  };

  const calculateShipping = () => {
    // משלוח חינם מעל 199 ש"ח
    return cart.totalAmount >= 199 ? 0 : 25;
  };

  const savings = calculateSavings();
  const shipping = calculateShipping();
  const finalTotal = cart.totalAmount + shipping - savings;

  if (cartLoading) {
    return (
      <div className="container py-8">
        <Loading size="large" text="טוען עגלת קניות..." />
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          עגלת הקניות שלי
        </h1>
        <p className="text-gray-600">
          {cart.items.length > 0 
            ? `${cart.totalItems} פריטים בעגלה`
            : 'העגלה שלך ריקה'
          }
        </p>
      </div>

      {cart.items.length === 0 ? (
        /* Empty Cart */
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3 className="empty-state-title">העגלה שלך ריקה</h3>
          <p className="empty-state-description">
            נראה שעדיין לא הוספת מוצרים לעגלה שלך
          </p>
          <Link to="/products" className="btn btn-primary btn-lg mt-6">
            🛍️ התחל לקנות
          </Link>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    פריטים בעגלה ({cart.items.length})
                  </h2>
                  
                  <button
                    onClick={handleClearCart}
                    className="btn btn-ghost btn-sm text-error-600"
                    disabled={cartLoading}
                  >
                    🗑️ נקה עגלה
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="relative">
                    <CartItem
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      loading={cartLoading}
                    />
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="p-6 border-t border-gray-200">
                <Link 
                  to="/products" 
                  className="btn btn-outline"
                >
                  ← המשך קניות
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  סיכום הזמנה
                </h3>

                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">סכום ביניים:</span>
                    <span className="font-medium">
                      {formatPrice(cart.totalAmount)}
                    </span>
                  </div>

                  {/* Savings */}
                  {savings > 0 && (
                    <div className="flex justify-between text-success-600">
                      <span>חסכת:</span>
                      <span className="font-medium">
                        -{formatPrice(savings)}
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">משלוח:</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-success-600' : ''}`}>
                      {shipping === 0 ? 'חינם!' : formatPrice(shipping)}
                    </span>
                  </div>

                  {/* Free Shipping Progress */}
                  {shipping > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-2">
                        עוד {formatPrice(199 - cart.totalAmount)} למשלוח חינם
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min((cart.totalAmount / 199) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>סה"כ לתשלום:</span>
                      <span className="text-primary-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* VAT Info */}
                  <p className="text-xs text-gray-500 text-center">
                    המחירים כולל מע"מ
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingOrder || cart.items.length === 0}
                  className="btn btn-primary btn-full btn-lg mt-6"
                >
                  {isProcessingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      מעבד הזמנה...
                    </span>
                  ) : (
                    <>💳 בצע הזמנה</>
                  )}
                </button>

                {/* Payment Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>🔒</span>
                    <span>תשלום מאובטח ומוצפן</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>↩️</span>
                    <span>החזרה עד 30 יום</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>🚚</span>
                    <span>משלוח תוך 24-48 שעות</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">אמצעי תשלום מקובלים:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💳</span>
                    <span className="text-lg">💳</span>
                    <span className="text-lg">💳</span>
                    <span className="text-lg">📱</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6">
              <h4 className="font-medium text-gray-900 mb-3">
                יש לך קוד הנחה?
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="הכנס קוד הנחה"
                  className="form-input flex-1"
                />
                <button className="btn btn-outline">
                  החל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed / Recommendations */}
      {cart.items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            מוצרים שצפית בהם לאחרונה
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500 text-center">
              מוצרים מומלצים יוצגו בקרוב...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;