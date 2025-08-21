import { USER_ROLES } from './constants'

// Permission definitions
export const PERMISSIONS = {
  // Product permissions
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  UPDATE_PRODUCTS: 'update_products',
  DELETE_PRODUCTS: 'delete_products',
  
  // Category permissions
  VIEW_CATEGORIES: 'view_categories',
  CREATE_CATEGORIES: 'create_categories',
  UPDATE_CATEGORIES: 'update_categories',
  DELETE_CATEGORIES: 'delete_categories',
  
  // Cart permissions
  ADD_TO_CART: 'add_to_cart',
  UPDATE_CART: 'update_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  
  // Order permissions
  CREATE_ORDER: 'create_order',
  VIEW_OWN_ORDERS: 'view_own_orders',
  VIEW_ALL_ORDERS: 'view_all_orders',
  
  // Review permissions
  ADD_REVIEW: 'add_review',
  UPDATE_OWN_REVIEW: 'update_own_review',
  DELETE_OWN_REVIEW: 'delete_own_review',
  MODERATE_REVIEWS: 'moderate_reviews',
  
  // User permissions
  VIEW_PROFILE: 'view_profile',
  UPDATE_PROFILE: 'update_profile',
  VIEW_ALL_USERS: 'view_all_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  
  // Admin permissions
  ACCESS_ADMIN_PANEL: 'access_admin_panel',
  UPLOAD_IMAGES: 'upload_images',
  MANAGE_SYSTEM: 'manage_system'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.ADD_TO_CART,
    PERMISSIONS.UPDATE_CART,
    PERMISSIONS.REMOVE_FROM_CART,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.ADD_REVIEW,
    PERMISSIONS.UPDATE_OWN_REVIEW,
    PERMISSIONS.DELETE_OWN_REVIEW,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE
  ],
  
  [USER_ROLES.ADMIN]: [
    // All user permissions
    ...ROLE_PERMISSIONS[USER_ROLES.USER] || [],
    
    // Additional admin permissions
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.UPDATE_CATEGORIES,
    PERMISSIONS.DELETE_CATEGORIES,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.UPDATE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.ACCESS_ADMIN_PANEL,
    PERMISSIONS.UPLOAD_IMAGES,
    PERMISSIONS.MANAGE_SYSTEM
  ]
}

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

// Check if user has any of the specified permissions
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !Array.isArray(permissions)) return false
  
  return permissions.some(permission => hasPermission(userRole, permission))
}

// Check if user has all of the specified permissions
export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !Array.isArray(permissions)) return false
  
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Get all permissions for a user role
export const getUserPermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || []
}

// Check if user is admin
export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN
}

// Check if user is regular user
export const isUser = (userRole) => {
  return userRole === USER_ROLES.USER
}

// Check if user can access admin panel
export const canAccessAdminPanel = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.ACCESS_ADMIN_PANEL)
}

// Check if user can manage products
export const canManageProducts = (userRole) => {
  return hasAnyPermission(userRole, [
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS
  ])
}

// Check if user can manage categories
export const canManageCategories = (userRole) => {
  return hasAnyPermission(userRole, [
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.UPDATE_CATEGORIES,
    PERMISSIONS.DELETE_CATEGORIES
  ])
}

// Check if user can manage orders
export const canManageOrders = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.VIEW_ALL_ORDERS)
}

// Check if user can manage users
export const canManageUsers = (userRole) => {
  return hasAnyPermission(userRole, [
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.UPDATE_USERS,
    PERMISSIONS.DELETE_USERS
  ])
}

// Check if user can moderate content
export const canModerateContent = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.MODERATE_REVIEWS)
}

// Check if user can upload images
export const canUploadImages = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.UPLOAD_IMAGES)
}

// Check if user can edit own content
export const canEditOwnContent = (userRole, ownerId, currentUserId) => {
  // Admin can edit anything
  if (isAdmin(userRole)) return true
  
  // User can edit their own content
  return ownerId === currentUserId
}

// Check if user can delete own content
export const canDeleteOwnContent = (userRole, ownerId, currentUserId) => {
  // Admin can delete anything
  if (isAdmin(userRole)) return true
  
  // User can delete their own content
  return ownerId === currentUserId
}

// Check if user can view content
export const canViewContent = (userRole, isPublic = true, ownerId = null, currentUserId = null) => {
  // Public content can be viewed by anyone
  if (isPublic) return true
  
  // Admin can view anything
  if (isAdmin(userRole)) return true
  
  // User can view their own content
  if (ownerId && currentUserId) {
    return ownerId === currentUserId
  }
  
  return false
}

// Check if user can perform cart operations
export const canUseCart = (userRole) => {
  return hasAnyPermission(userRole, [
    PERMISSIONS.ADD_TO_CART,
    PERMISSIONS.UPDATE_CART,
    PERMISSIONS.REMOVE_FROM_CART
  ])
}

// Check if user can create orders
export const canCreateOrder = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.CREATE_ORDER)
}

// Check if user can add reviews
export const canAddReview = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.ADD_REVIEW)
}

// Permission checker factory - returns a function that checks permissions
export const createPermissionChecker = (userRole, currentUserId = null) => {
  return {
    // Basic role checks
    isAdmin: () => isAdmin(userRole),
    isUser: () => isUser(userRole),
    
    // Permission checks
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    
    // Feature-specific checks
    canAccessAdminPanel: () => canAccessAdminPanel(userRole),
    canManageProducts: () => canManageProducts(userRole),
    canManageCategories: () => canManageCategories(userRole),
    canManageOrders: () => canManageOrders(userRole),
    canManageUsers: () => canManageUsers(userRole),
    canModerateContent: () => canModerateContent(userRole),
    canUploadImages: () => canUploadImages(userRole),
    canUseCart: () => canUseCart(userRole),
    canCreateOrder: () => canCreateOrder(userRole),
    canAddReview: () => canAddReview(userRole),
    
    // Ownership checks
    canEditOwnContent: (ownerId) => canEditOwnContent(userRole, ownerId, currentUserId),
    canDeleteOwnContent: (ownerId) => canDeleteOwnContent(userRole, ownerId, currentUserId),
    canViewContent: (isPublic, ownerId) => canViewContent(userRole, isPublic, ownerId, currentUserId),
    
    // Get all permissions
    getAllPermissions: () => getUserPermissions(userRole)
  }
}

// Default permission checker for unauthenticated users
export const getGuestPermissions = () => {
  return createPermissionChecker(null, null)
}

// Helper function to check resource access
export const checkResourceAccess = (userRole, resourceType, action, resourceOwnerId = null, currentUserId = null) => {
  const permissionMap = {
    product: {
      view: PERMISSIONS.VIEW_PRODUCTS,
      create: PERMISSIONS.CREATE_PRODUCTS,
      update: PERMISSIONS.UPDATE_PRODUCTS,
      delete: PERMISSIONS.DELETE_PRODUCTS
    },
    category: {
      view: PERMISSIONS.VIEW_CATEGORIES,
      create: PERMISSIONS.CREATE_CATEGORIES,
      update: PERMISSIONS.UPDATE_CATEGORIES,
      delete: PERMISSIONS.DELETE_CATEGORIES
    },
    order: {
      view: resourceOwnerId === currentUserId ? PERMISSIONS.VIEW_OWN_ORDERS : PERMISSIONS.VIEW_ALL_ORDERS,
      create: PERMISSIONS.CREATE_ORDER
    },
    review: {
      view: PERMISSIONS.VIEW_PRODUCTS, // Reviews are part of products
      create: PERMISSIONS.ADD_REVIEW,
      update: resourceOwnerId === currentUserId ? PERMISSIONS.UPDATE_OWN_REVIEW : PERMISSIONS.MODERATE_REVIEWS,
      delete: resourceOwnerId === currentUserId ? PERMISSIONS.DELETE_OWN_REVIEW : PERMISSIONS.MODERATE_REVIEWS
    },
    user: {
      view: resourceOwnerId === currentUserId ? PERMISSIONS.VIEW_PROFILE : PERMISSIONS.VIEW_ALL_USERS,
      update: resourceOwnerId === currentUserId ? PERMISSIONS.UPDATE_PROFILE : PERMISSIONS.UPDATE_USERS,
      delete: PERMISSIONS.DELETE_USERS // Only admin can delete users
    }
  }
  
  const permission = permissionMap[resourceType]?.[action]
  if (!permission) return false
  
  return hasPermission(userRole, permission)
}