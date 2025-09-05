// client/src/utils/orderUtils.js

export const getStatusLabel = (status) => {
  // Debug log to see what we're getting
  console.log('getStatusLabel received:', status, typeof status);
  
  const statusMap = {
    'pending': 'Pending',
    'paid': 'Paid',
    'shipped': 'Shipped', 
    'cancelled': 'Cancelled',
    // Legacy support
    'completed': 'Completed'
  };
  return statusMap[status] || `Unknown (${status})`;
};

export const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'paid': 'text-blue-600 bg-blue-100',
    'shipped': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100',
    // Legacy support
    'completed': 'text-green-600 bg-green-100'
  };
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

export const getStatusIcon = (status) => {
  const iconMap = {
    'pending': '⏳',
    'paid': '✅', 
    'shipped': '🚚',
    'cancelled': '❌',
    // Legacy support
    'completed': '✅'
  };
  return iconMap[status] || '❓';
};
