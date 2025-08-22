// src/pages/Orders.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { formatPrice, formatDate, getOrderStatusLabel } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';
import Loading from '../components/common/Loading';

const Orders = () => {
  const { orders, loading, error, loadOrders } = useOrders();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // פילטור הזמנות
  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  // מיון הזמנות
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'amount-high':
        return b.total - a.total;
      case 'amount-low':
        return a.total - b.total;
      default:
        return 0;
    }
  });

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

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === ORDER_STATUSES.PENDING).length,
      shipped: orders.filter(o => o.status === ORDER_STATUSES.SHIPPED).length,
      totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="container py-8">
        <Loading size="large" text="טוען הזמנות..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="error-container">
          <h2 className="error-title">שגיאה בטעינת הזמנות</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={loadOrders}
            className="btn btn-primary mt-4"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ההזמנות שלי
        </h1>
        <p className="text-gray-600">
          עקוב אחר ההזמנות שלך וצפה בהיסטוריית הרכישות
        </p>
      </div>

      {orders.length === 0 ? (
        /* No Orders */
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">עדיין לא ביצעת הזמנות</h3>
          <p className="empty-state-description">
            כשתבצע הזמנות, הן יופיעו כאן
          </p>
          <Link to="/products" className="btn btn-primary btn-lg mt-6">
            🛍️ התחל לקנות
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  📋
                </div>
                <div>
                  <p className="text-sm text-gray-600">סה"כ הזמנות</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  ⏳
                </div>
                <div>
                  <p className="text-sm text-gray-600">בטיפול</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="text-sm text-gray-600">נשלחו</p>
                  <p className="text-xl font-bold text-gray-900">{stats.shipped}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  💰
                </div>
                <div>
                  <p className="text-sm text-gray-600">סה"כ הוצאות</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(stats.totalSpent)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סינון לפי סטטוס
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="all">כל ההזמנות</option>
                  <option value={ORDER_STATUSES.PENDING}>ממתין לתשלום</option>
                  <option value={ORDER_STATUSES.PAID}>שולם</option>
                  <option value={ORDER_STATUSES.SHIPPED}>נשלח</option>
                  <option value={ORDER_STATUSES.CANCELLED}>בוטל</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מיון לפי
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="newest">חדשות ביותר</option>
                  <option value="oldest">ישנות ביותר</option>
                  <option value="amount-high">סכום גבוה לנמוך</option>
                  <option value="amount-low">סכום נמוך לגבוה</option>
                </select>
              </div>

              {/* Results Info */}
              <div className="flex items-end">
                <p className="text-sm text-gray-600">
                  מציג {sortedOrders.length} מתוך {orders.length} הזמנות
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        הזמנה #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        נוצרה ב{formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      {getStatusBadge(order.status)}
                      <div className="text-left">
                        <p className="text-sm text-gray-600">סכום ההזמנה</p>
                        <p className="text-xl font-bold text-primary-600">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-outline flex-1 md:flex-none"
                    >
                      👁️ צפה בפרטים
                    </Link>

                    {order.status === ORDER_STATUSES.SHIPPED && (
                      <button className="btn btn-outline flex-1 md:flex-none">
                        📍 מעקב משלוח
                      </button>
                    )}

                    {order.status === ORDER_STATUSES.PAID && (
                      <button className="btn btn-outline flex-1 md:flex-none">
                        📧 שלח שוב קבלה
                      </button>
                    )}

                    {(order.status === ORDER_STATUSES.PENDING || order.status === ORDER_STATUSES.PAID) && (
                      <button className="btn btn-outline text-error-600 border-error-300 hover:bg-error-50 flex-1 md:flex-none">
                        ❌ בטל הזמנה
                      </button>
                    )}
                  </div>

                  {/* Order Progress */}
                  {order.status !== ORDER_STATUSES.CANCELLED && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center gap-2 ${
                          [ORDER_STATUSES.PENDING, ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED].includes(order.status)
                            ? 'text-success-600' : 'text-gray-400'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          <span>הזמנה התקבלה</span>
                        </div>

                        <div className={`flex items-center gap-2 ${
                          [ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED].includes(order.status)
                            ? 'text-success-600' : 'text-gray-400'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          <span>תשלום אושר</span>
                        </div>

                        <div className={`flex items-center gap-2 ${
                          order.status === ORDER_STATUSES.SHIPPED
                            ? 'text-success-600' : 'text-gray-400'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          <span>נשלח</span>
                        </div>
                      </div>

                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-success-600 h-1 rounded-full transition-all"
                          style={{
                            width: order.status === ORDER_STATUSES.PENDING ? '33%' :
                                   order.status === ORDER_STATUSES.PAID ? '66%' :
                                   order.status === ORDER_STATUSES.SHIPPED ? '100%' : '0%'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More or Pagination */}
          {sortedOrders.length >= 10 && (
            <div className="mt-8 text-center">
              <button className="btn btn-outline">
                טען עוד הזמנות
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;