import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { AdminContext } from '../../../context/AdminContext';
import Loading from '../Loading/Loading';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { isAdmin, loading } = useContext(AdminContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user || !isAdmin) {
    // Redirect to login if not authenticated, or to home if authenticated but not admin
    return <Navigate to={user ? "/" : "/login"} state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
