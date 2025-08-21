// src/components/products/ProductForm/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import './ProductForm.css';

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Populate form if editing existing product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
        image: null // Don't pre-populate image
      });
      
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF)'
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare simple object data for submission
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id),
      image: formData.image // File object or null
    };

    onSubmit(submitData);
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    
    // Clear file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <p>{product ? 'Update product information' : 'Fill in the details to create a new product'}</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form-content">
        <div className="form-grid">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter product name"
              disabled={loading}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`form-select ${errors.category_id ? 'error' : ''}`}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <span className="error-text">{errors.category_id}</span>}
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="0.00"
              disabled={loading}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.stock ? 'error' : ''}`}
              placeholder="0"
              disabled={loading}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter product description"
            disabled={loading}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Image Upload */}
        <div className="form-group full-width">
          <label htmlFor="image">Product Image</label>
          <div className="image-upload-section">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Product preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="image-placeholder">
                <span>📷</span>
                <p>No image selected</p>
              </div>
            )}
            
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              disabled={loading}
            />
            <label htmlFor="image" className="file-input-label">
              {imagePreview ? 'Change Image' : 'Choose Image'}
            </label>
            
            {errors.image && <span className="error-text">{errors.image}</span>}
            <p className="file-help">Supported formats: JPEG, PNG, GIF. Max size: 5MB</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (product ? 'Updating...' : 'Creating...') : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;