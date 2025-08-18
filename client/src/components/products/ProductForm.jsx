import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { validatePrice } from '../../utils/validation';
import { ButtonSpinner } from '../common/Loading';
import './ProductForm.css';

const ProductForm = ({ product = null, onSubmit, onCancel, className = '' }) => {
  const navigate = useNavigate();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load categories and populate form if editing
  useEffect(() => {
    loadCategories();
    
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category_id: product.category_id?.toString() || '',
        image: null // Don't prefill image file input
      });
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create image preview
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear global messages
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    // Validate price
    const priceValidation = validatePrice(formData.price);
    if (!priceValidation.isValid) {
      errors.price = priceValidation.message;
    }

    // Validate stock
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      errors.stock = 'Stock must be a valid number (0 or greater)';
    }

    // Validate category
    if (!formData.category_id) {
      errors.category_id = 'Please select a category';
    }

    // Validate image (only required for new products)
    if (!isEditing && !formData.image) {
      errors.image = 'Please select a product image';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('price', parseFloat(formData.price));
      submitData.append('stock', parseInt(formData.stock));
      submitData.append('category_id', parseInt(formData.category_id));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let result;
      if (isEditing) {
        result = await productService.updateProduct(product.id, submitData);
      } else {
        result = await productService.createProduct(submitData);
      }

      setSuccess(isEditing ? 'Product updated successfully!' : 'Product created successfully!');

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(result.data);
      } else {
        // Redirect to products page after a short delay
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      }

      // Reset form if creating new product
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category_id: '',
          image: null
        });
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/admin/products');
    }
  };

  return (
    <div className={`product-form-container ${className}`}>
      <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
        <div className="form-header">
          <h2 className="form-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="form-subtitle">
            {isEditing ? 'Update product information' : 'Fill in the product details below'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="Enter product name"
                required
                disabled={isLoading}
              />
              {formErrors.name && (
                <span className="form-error">{formErrors.name}</span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-textarea ${formErrors.description ? 'error' : ''}`}
                placeholder="Enter product description"
                rows="4"
                required
                disabled={isLoading}
              />
              {formErrors.description && (
                <span className="form-error">{formErrors.description}</span>
              )}
            </div>

            {/* Price and Stock Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={isLoading}
                />
                {formErrors.price && (
                  <span className="form-error">{formErrors.price}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="stock" className="form-label">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.stock ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                  required
                  disabled={isLoading}
                />
                {formErrors.stock && (
                  <span className="form-error">{formErrors.stock}</span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category_id" className="form-label">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={`form-select ${formErrors.category_id ? 'error' : ''}`}
                required
                disabled={isLoading || isLoadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category_id && (
                <span className="form-error">{formErrors.category_id}</span>
              )}
              {isLoadingCategories && (
                <span className="form-help">Loading categories...</span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            {/* Product Image */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Product Image {!isEditing && '*'}
              </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  className={`form-input-file ${formErrors.image ? 'error' : ''}`}
                  accept="image/*"
                  disabled={isLoading}
                />
                <div className="image-upload-help">
                  <p>Choose a product image (JPEG, PNG, or GIF)</p>
                  <p>Maximum file size: 5MB</p>
                </div>
              </div>
              {formErrors.image && (
                <span className="form-error">{formErrors.image}</span>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <h4>Preview:</h4>
                <img src={imagePreview} alt="Preview" className="preview-image" />
              </div>
            )}

            {/* Current Image (when editing) */}
            {isEditing && product?.image && !imagePreview && (
              <div className="current-image">
                <h4>Current Image:</h4>
                <img 
                  src={productService.getImageUrl(product.image)} 
                  alt={product.name} 
                  className="current-image-preview" 
                />
                <p className="image-note">Upload a new image to replace the current one</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ButtonSpinner size="small" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;