import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { AdminProvider } from './AdminContext';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default AppProvider;
