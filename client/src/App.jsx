import AdminSetup from './pages/admin/AdminSetup/AdminSetup';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement/ProductManagement';
import UserManagement from './pages/admin/UserManagement/UserManagement';
import OrderManagement from './pages/admin/OrderManagement/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement/CategoryManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage'; // Add this import
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


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  {/* Category Routes */}
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />
                  
                  <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/setup" element={<AdminSetup />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/categories" element={<CategoryManagement />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;