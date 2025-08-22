import { USER_ROLES } from './constants';

// Permission checks
export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

// Resource access permissions
export const canManageProducts = (user) => {
  return isAdmin(user);
};

export const canManageCategories = (user) => {
  return isAdmin(user);
};

export const canManageUsers = (user) => {
  return isAdmin(user);
};

export const canManageOrders = (user) => {
  return isAdmin(user);
};

// User-specific permissions
export const canAccessUserData = (user, targetUserId) => {
  return isAdmin(user) || user?.id === targetUserId;
};

export const canEditReview = (user, review) => {
  return user?.id === review.user_id;
};

export const canCancelOrder = (user, order) => {
  if (isAdmin(user)) return true;
  if (user?.id !== order.user_id) return false;
  
  // Users can only cancel pending or processing orders
  const cancelableStatuses = ['pending', 'processing'];
  return cancelableStatuses.includes(order.status.toLowerCase());
};

// Route access permissions
export const canAccessRoute = (user, route) => {
  // Public routes
  const publicRoutes = ['/login', '/register', '/products', '/'];
  if (publicRoutes.includes(route)) return true;

  // Must be logged in for these routes
  if (!user) return false;

  // Admin-only routes
  const adminRoutes = ['/admin', '/admin/'];
  if (adminRoutes.some(prefix => route.startsWith(prefix))) {
    return isAdmin(user);
  }

  // User-specific routes
  const userRoutes = ['/profile', '/orders', '/cart'];
  if (userRoutes.some(prefix => route.startsWith(prefix))) {
    return true;
  }

  return false;
};

// Feature access permissions
export const canAccessFeature = (user, feature) => {
  switch (feature) {
    case 'dashboard':
    case 'user_management':
    case 'product_management':
    case 'category_management':
    case 'order_management':
      return isAdmin(user);
    
    case 'cart':
    case 'orders':
    case 'reviews':
    case 'profile':
      return !!user;
    
    case 'product_view':
    case 'category_view':
      return true;
    
    default:
      return false;
  }
};
