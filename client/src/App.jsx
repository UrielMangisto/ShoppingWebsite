import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layout components
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute'

// Public pages
import HomePage from './pages/HomePage/HomePage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage'
import CategoryPage from './pages/CategoryPage/CategoryPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage/LoginPage'
import RegisterPage from './pages/auth/RegisterPage/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage/ResetPasswordPage'

// User pages (protected)
import CartPage from './pages/CartPage/CartPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import OrdersPage from './pages/orders/OrdersPage/OrdersPage'
import OrderDetailPage from './pages/orders/OrderDetailPage/OrderDetailPage'

// Admin pages (admin only)
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories/AdminCategories'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Header />
          
          <main className="main">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              
              {/* Routes d'authentification */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Routes protégées (utilisateur connecté) */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } />
              
              {/* Routes admin (admin seulement) */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute requireAdmin>
                  <AdminCategories />
                </ProtectedRoute>
              } />
              
              {/* Route 404 */}
              <Route path="*" element={
                <div className="not-found">
                  <h1>404 - Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App