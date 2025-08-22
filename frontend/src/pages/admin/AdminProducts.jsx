import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar/AdminSidebar';
import ProductList from '../../components/admin/ProductManagement/ProductList';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import ConfirmationModal from '../../components/common/ConfirmationModal/ConfirmationModal';
import './AdminProducts.css';

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await fetchProducts();
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts]);

  const handleSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedProducts(
      event.target.checked
        ? products.map(product => product._id)
        : []
    );
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        setSelectedProducts([]);
      } catch (err) {
        setError(err.message || 'Failed to delete products');
      }
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete);
        setSelectedProducts(prev => prev.filter(id => id !== productToDelete));
      } else if (selectedProducts.length > 0) {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        setSelectedProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product(s)');
    } finally {
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <header className="products-header">
              <h1>Products Management</h1>
              <div className="header-actions">
                <Link to="/admin/products/new" className="add-product-button">
                  Add New Product
                </Link>
                {selectedProducts.length > 0 && (
                  <button 
                    className="bulk-delete-button"
                    onClick={() => {
                      setProductToDelete(null);
                      setShowConfirmModal(true);
                    }}
                  >
                    Delete Selected ({selectedProducts.length})
                  </button>
                )}
              </div>
            </header>

            <ProductList
              products={products}
              selectedProducts={selectedProducts}
              onSelectAll={handleSelectAll}
              onSelect={handleSelect}
              onDeleteClick={handleDeleteClick}
            />

            {showConfirmModal && (
              <ConfirmationModal
                isOpen={showConfirmModal}
                title="Confirm Delete"
                message={productToDelete 
                  ? "Are you sure you want to delete this product?" 
                  : `Are you sure you want to delete ${selectedProducts.length} products?`
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                  setShowConfirmModal(false);
                  setProductToDelete(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
