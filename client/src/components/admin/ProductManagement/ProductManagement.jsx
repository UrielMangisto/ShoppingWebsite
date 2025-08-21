import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { productsService } from '../../../services/productsService';
import ProductForm from '../../products/ProductForm/ProductForm';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { success, data } = await execute(productsService.getProducts);
    if (success) {
      setProducts(data);
    }
  };

  const handleCreateProduct = async (productData) => {
    const { success, data } = await execute(() => 
      productsService.createProduct(productData)
    );
    if (success) {
      setProducts([...products, data]);
      setShowForm(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    const { success, data } = await execute(() => 
      productsService.updateProduct(editingProduct._id, productData)
    );
    if (success) {
      setProducts(products.map(product => 
        product._id === editingProduct._id ? data : product
      ));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { success } = await execute(() => 
        productsService.deleteProduct(productId)
      );
      if (success) {
        setProducts(products.filter(product => product._id !== productId));
      }
    }
  };

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Manage Products</h2>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {(showForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setEditingProduct(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="stock">Stock: {product.stock}</p>
            </div>
            <div className="product-actions">
              <button 
                className="edit-btn"
                onClick={() => setEditingProduct(product)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteProduct(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;