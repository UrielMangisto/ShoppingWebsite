import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { AdminProvider } from './AdminContext';

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          {children}
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}
