import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Loading from '../Loading/Loading'
import './ProtectedRoute.css'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <Loading size="large" message="Checking authentication..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="protected-route-error">
        <div className="error-container">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>Admin access is required.</p>
          <button 
            onClick={() => window.history.back()}
            className="back-button"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Render the protected content
  return children
}

export default ProtectedRoute