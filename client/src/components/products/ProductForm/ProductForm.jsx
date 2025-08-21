import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { productsService } from '../../../services/productsService';
import { categoriesService } from '../../../services/categoriesService';
import { ImageUpload } from '../../admin/ImageUpload/ImageUpload';
import './ProductForm.css';

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: null
  });

  const [categories, setCategories] = useState([]);
  const { execute: fetchCategories } = useApi();
  const { execute: submitProduct, loading, error } = useApi();

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price.toString(),
        stock: initialProduct.stock.toString(),
        categoryId: initialProduct.categoryId,
        image: initialProduct.image
      });
    }
    loadCategories();
  }, [initialProduct]);

  const loadCategories = async () => {
    const { success, data } = await fetchCategories(categoriesService.getCategories);
    if (success) {
      setCategories(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    const apiFunction = initialProduct 
      ? () => productsService.updateProduct(initialProduct._id, productData)
      : () => productsService.createProduct(productData);

    const { success, data } = await submitProduct(apiFunction);
    if (success) {
      onSubmit(data);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-control"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="form-control"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Product Image</label>
        <ImageUpload
          initialImage={formData.image}
          onUploadComplete={handleImageUpload}
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialProduct ? 'Update Product' : 'Create Product'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;