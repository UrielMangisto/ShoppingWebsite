import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import './App.css'

// Pages
import HomePage from './pages/HomePage/HomePage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import CartPage from './pages/CartPage/CartPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AdminProvider>
            <div className="app-container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Routes>
            </div>
          </AdminProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
