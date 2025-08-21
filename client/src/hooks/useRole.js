import { useAuth } from './useAuth'

export const useRole = () => {
  const { user, isAuthenticated } = useAuth()

  // Check if user is admin
  const isAdmin = () => {
    return isAuthenticated && user?.role === 'admin'
  }

  // Check if user is regular user
  const isUser = () => {
    return isAuthenticated && user?.role === 'user'
  }

  // Check if user has specific permission
  const hasPermission = (requiredRole) => {
    if (!isAuthenticated || !user) return false
    
    // Admin has all permissions
    if (user.role === 'admin') return true
    
    // Check specific role
    return user.role === requiredRole
  }

  // Check if user can access admin features
  const canAccessAdmin = () => {
    return isAdmin()
  }

  // Check if user can edit/delete their own content
  const canEditOwn = (ownerId) => {
    if (!isAuthenticated || !user) return false
    
    // Admin can edit anything
    if (user.role === 'admin') return true
    
    // User can edit their own content
    return user.id === ownerId
  }

  // Check if user can create content
  const canCreate = () => {
    return isAuthenticated
  }

  // Check if user can moderate (admin only)
  const canModerate = () => {
    return isAdmin()
  }

  // Get user role display name
  const getRoleDisplayName = () => {
    if (!user?.role) return 'Guest'
    
    switch (user.role) {
      case 'admin':
        return 'Administrator'
      case 'user':
        return 'User'
      default:
        return 'Unknown'
    }
  }

  // Get permissions list for current user
  const getPermissions = () => {
    if (!isAuthenticated || !user) {
      return []
    }

    const permissions = ['view_products', 'view_categories']

    if (user.role === 'user') {
      permissions.push(
        'add_to_cart',
        'create_orders',
        'view_own_orders',
        'add_reviews',
        'edit_own_reviews'
      )
    }

    if (user.role === 'admin') {
      permissions.push(
        'manage_products',
        'manage_categories',
        'manage_users',
        'view_all_orders',
        'moderate_reviews',
        'access_admin_panel'
      )
    }

    return permissions
  }

  // Check if user has specific permission by name
  const hasSpecificPermission = (permission) => {
    const userPermissions = getPermissions()
    return userPermissions.includes(permission)
  }

  return {
    // Role checks
    isAdmin,
    isUser,
    hasPermission,
    canAccessAdmin,
    canEditOwn,
    canCreate,
    canModerate,
    hasSpecificPermission,
    
    // User info
    role: user?.role || null,
    roleDisplayName: getRoleDisplayName(),
    permissions: getPermissions(),
    
    // User state
    isAuthenticated,
    user
  }
}