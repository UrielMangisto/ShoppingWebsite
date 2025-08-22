// src/pages/OrderDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { formatPrice, formatDate, getOrderStatusLabel } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';
import Loading from '../components/common/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(id);

  const getStatusBadge = (status) => {
    const statusClasses = {
      [ORDER_STATUSES.PENDING]: 'badge-warning',
      [ORDER_STATUSES.PAID]: 'badge-primary',
      [ORDER_STATUSES.SHIPPED]: 'badge-success',
      [ORDER_STATUSES.CANCELLED]: 'badge-error'
    };

    const statusIcons = {
      [ORDER_STATUSES.PENDING]: '⏳',
      [ORDER_STATUSES.PAID]: '💳',
      [ORDER_STATUSES.SHIPPED]: '📦',
      [ORDER_STATUSES.CANCELLED]: '❌'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'badge-gray'}`}>
        {statusIcons[status]} {getOrderStatusLabel(status)}
      </span>
    );
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return 25;
      case ORDER_STATUSES.PAID:
        return 50;
      case ORDER_STATUSES.SHIPPED:
        return 100;
      case ORDER_STATUSES.CANCELLED:
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Loading size="large" text="טוען פרטי הזמנה..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-8">
        <div className="error-container">
          <h2 className="error-title">שגיאה</h2>
          <p className="error-message">
            {error || 'ההזמנה לא נמצאה'}
          </p>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              חזרה
            </button>
            <Link to="/orders" className="btn btn-primary">
              לכל ההזמנות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary-600">בית</Link>
        <span>›</span>
        <Link to="/orders" className="hover:text-primary-600">ההזמנות שלי</Link>
        <span>›</span>
        <span className="text-gray-900">הזמנה #{order.order.id}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              הזמנה #{order.order.id}
            </h1>
            <p className="text-gray-600">
              נוצרה ב{formatDate(order.order.created_at)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(order.order.status)}
            <div className="text-2xl font-bold text-primary-600">
              {formatPrice(order.order.total)}
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {order.order.status !== ORDER_STATUSES.CANCELLED && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              מעקב ההזמנה
            </h3>
            
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(order.order.status)}%` }}
                />
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between text-sm">
                <div className={`flex flex-col items-center ${
                  [ORDER_STATUSES.PENDING, ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED].includes(order.order.status)
                    ? 'text-success-600' : 'text-gray-400'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-current"></span>
                  </div>
                  <span>הזמנה התקבלה</span>
                </div>

                <div className={`flex flex-col items-center ${
                  [ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED].includes(order.order.status)
                    ? 'text-success-600' : 'text-gray-400'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-current"></span>
                  </div>
                  <span>תשלום אושר</span>
                </div>

                <div className={`flex flex-col items-center ${
                  order.order.status === ORDER_STATUSES.SHIPPED
                    ? 'text-success-600' : 'text-gray-400'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-current"></span>
                  </div>
                  <span>נשלח</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          {order.order.status === ORDER_STATUSES.SHIPPED && (
            <button className="btn btn-primary">
              📍 מעקב משלוח
            </button>
          )}

          {order.order.status === ORDER_STATUSES.PAID && (
            <button className="btn btn-outline">
              📧 שלח שוב קבלה
            </button>
          )}

          {(order.order.status === ORDER_STATUSES.PENDING || order.order.status === ORDER_STATUSES.PAID) && (
            <button className="btn btn-outline text-error-600 border-error-300 hover:bg-error-50">
              ❌ בטל הזמנה
            </button>
          )}

          <button 
            onClick={() => window.print()}
            className="btn btn-outline"
          >
            🖨️ הדפס
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                פריטים בהזמנה ({order.items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.image_id ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/${item.image_id}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      <div 
                        className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xl"
                        style={{ display: item.image_id ? 'none' : 'flex' }}
                      >
                        📦
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          כמות: {item.quantity}
                        </span>
                        <span className="text-sm text-gray-600">
                          מחיר יחידה: {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              סיכום הזמנה
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">סכום ביניים:</span>
                <span className="font-medium">
                  {formatPrice(order.order.total)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">משלוח:</span>
                <span className="font-medium text-success-600">
                  חינם
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">מע"מ:</span>
                <span className="font-medium">
                  כלול במחיר
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>סה"כ:</span>
                  <span className="text-primary-600">
                    {formatPrice(order.order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              מידע על משלוח
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">כתובת משלוח:</span>
                <p className="text-gray-600 mt-1">
                  רחוב הדוגמה 123<br />
                  תל אביב, 12345<br />
                  ישראל
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700">זמן משלוח צפוי:</span>
                <p className="text-gray-600 mt-1">
                  {order.order.status === ORDER_STATUSES.SHIPPED 
                    ? 'נשלח - יגיע תוך 1-2 ימי עסקים'
                    : order.order.status === ORDER_STATUSES.PAID
                    ? 'יישלח תוך 24 שעות'
                    : 'יישלח לאחר אישור התשלום'
                  }
                </p>
              </div>

              {order.order.status === ORDER_STATUSES.SHIPPED && (
                <div>
                  <span className="font-medium text-gray-700">מספר מעקב:</span>
                  <p className="text-primary-600 mt-1 font-mono">
                    IL123456789
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              מידע על תשלום
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">אמצעי תשלום:</span>
                <span className="font-medium">כרטיס אשראי</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">כרטיס מסתיים ב:</span>
                <span className="font-medium">****1234</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">סטטוס תשלום:</span>
                <span className={`font-medium ${
                  order.order.status === ORDER_STATUSES.PENDING 
                    ? 'text-warning-600' 
                    : 'text-success-600'
                }`}>
                  {order.order.status === ORDER_STATUSES.PENDING ? 'ממתין' : 'שולם'}
                </span>
              </div>

              {order.order.status !== ORDER_STATUSES.PENDING && (
                <div className="flex justify-between">
                  <span className="text-gray-600">תאריך תשלום:</span>
                  <span className="font-medium">
                    {formatDate(order.order.created_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Service */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              זקוק לעזרה?
            </h3>

            <div className="space-y-3">
              <Link 
                to="/contact" 
                className="btn btn-outline btn-sm btn-full"
              >
                💬 צור קשר
              </Link>

              <Link 
                to="/faq" 
                className="btn btn-ghost btn-sm btn-full"
              >
                ❓ שאלות נפוצות
              </Link>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  או התקשר אלינו:
                </p>
                <a 
                  href="tel:03-1234567" 
                  className="text-primary-600 font-medium"
                >
                  03-1234567
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  ראשון-חמישי 9:00-18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Actions */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          פעולות נוספות
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/orders" 
            className="btn btn-outline"
          >
            📋 כל ההזמנות שלי
          </Link>

          <Link 
            to="/products" 
            className="btn btn-outline"
          >
            🛍️ המשך קניות
          </Link>

          <button 
            onClick={() => {
              // כאן אפשר להוסיף לוגיקה להזמנה חוזרת
              alert('תכונה זו תהיה זמינה בקרוב');
            }}
            className="btn btn-outline"
          >
            🔄 הזמן שוב
          </button>
        </div>
      </div>

      {/* Return Policy */}
      <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-primary-600 text-lg">ℹ️</span>
          <div>
            <h4 className="font-medium text-primary-800 mb-1">
              מדיניות החזרות
            </h4>
            <p className="text-sm text-primary-700">
              ניתן להחזיר מוצרים עד 30 יום מתאריך הקבלה. 
              המוצרים חייבים להיות במצב חדש ובאריזה המקורית.
              <Link to="/returns" className="underline hover:no-underline mr-1">
                קרא עוד על מדיניות החזרות
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;