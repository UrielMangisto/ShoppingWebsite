// Main Application Component - React Router setup with Context Providers
// This is the root component that sets up routing and global state management
import AdminSetup from './pages/admin/AdminSetup/AdminSetup';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement/ProductManagement';
import UserManagement from './pages/admin/UserManagement/UserManagement';
import OrderManagement from './pages/admin/OrderManagement/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement/CategoryManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers for global state management
import { AuthProvider } from './context/AuthContext';     // User authentication state
import { CartProvider } from './context/CartContext';     // Shopping cart state  
import { ProductsProvider } from './context/ProductsContext'; // Products and filtering state

// Page Components
import CategoryPage from './pages/CategoryPage/CategoryPage';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductPage';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import LoginPage from './pages/auth/LoginPage/LoginPage';
import RegisterPage from './pages/auth/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import OrderDetailPage from './pages/OrderDetailPage/OrderDetailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage/ResetPasswordPage';

// Styles
import './App.css';

// Main App Component with nested provider structure for state management
function App() {
  return (
    // Provider hierarchy: Auth → Cart → Products → Router
    // This structure ensures that all components have access to authentication, cart, and product state
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Router>
            <div className="App">
              {/* Global Navigation Component */}
              <Header />
              
              {/* Main Content Area */}
              <main>
                <Routes>
                  {/* Public Routes - accessible to all users */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  
                  {/* Shopping Routes */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Category Routes */}
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />
                  
                  {/* Order Management */}
                  <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                  
                  {/* Admin Routes - Protected routes requiring admin privileges */}
                  {/* Admin Routes - Protected routes requiring admin privileges */}
                  <Route path="/admin/setup" element={<AdminSetup />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/categories" element={<CategoryManagement />} />
                </Routes>
              </main>
              
              {/* Global Footer Component */}
              <Footer />
            </div>
          </Router>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;