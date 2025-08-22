// src/pages/admin/ProductManagement/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductsContext';
import { useApi } from '../../../hooks/useApi';
import { productsService } from '../../../services/productsService';
import ProductForm from '../../../components/products/ProductForm/ProductForm';
import './ProductManagement.css';

const ProductManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, loading, fetchProducts } = useProducts();
  const { loading: apiLoading, execute } = useApi();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchProducts();
    }
  }, [isAuthenticated, user]);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (productData) => {
    console.log('📝 ProductManagement: Form submitted with data:', productData);
    
    try {
      if (editingProduct) {
        console.log('✏️ Updating product ID:', editingProduct.id);
        const result = await execute(() => productsService.updateProduct(editingProduct.id, productData));
        console.log('✅ Update result:', result);
        alert('Product updated successfully!');
      } else {
        console.log('➕ Creating new product');
        const result = await execute(() => productsService.createProduct(productData));
        console.log('✅ Create result:', result);
        alert('Product created successfully!');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('❌ Product operation error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await execute(() => productsService.deleteProduct(productId));
      alert('Product deleted successfully!');
      setDeleteConfirm(null);
      await fetchProducts(); // Refresh products list
    } catch (error) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  const confirmDelete = (product) => {
    setDeleteConfirm(product);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Admin privileges required.</p>
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="admin-page">
        <div className="container">
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={apiLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Product Management</h1>
            <p>Manage your product catalog</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateProduct}
          >
            Add New Product
          </button>
        </div>

        <div className="management-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="stats">
            <span>Total Products: {products.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-image-cell">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} />
                          ) : (
                            <div className="no-image">📷</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-name-cell">
                          <strong>{product.name}</strong>
                          <span>{product.description.substring(0, 50)}...</span>
                        </div>
                      </td>
                      <td>{product.category_name || 'Uncategorized'}</td>
                      <td className="price-cell">${product.price}</td>
                      <td className={`stock-cell ${product.stock <= 5 ? 'low-stock' : ''}`}>
                        {product.stock}
                      </td>
                      <td>
                        {product.average_rating ? (
                          <div className="rating-cell">
                            <span>★ {parseFloat(product.average_rating).toFixed(1)}</span>
                            <small>({product.review_count})</small>
                          </div>
                        ) : (
                          <span className="no-rating">No reviews</span>
                        )}
                      </td>
                      <td>{formatDate(product.created_at)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmDelete(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      {searchTerm ? 'No products match your search.' : 'No products found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirm Delete</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"?</p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={apiLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteProduct(deleteConfirm.id)}
                  disabled={apiLoading}
                >
                  {apiLoading ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;