import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import Loading from '../common/Loading';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingCategory) {
        // Update existing category
        await categoryService.updateCategory(editingCategory.id, formData);
        setSuccess('Category updated successfully');
      } else {
        // Create new category
        await categoryService.createCategory(formData);
        setSuccess('Category created successfully');
      }

      // Reset form and reload categories
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(category.id);
      setSuccess('Category deleted successfully');
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    setSuccess(null);
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (isLoading) {
    return <Loading size="large" text="Loading categories..." />;
  }

  return (
    <div className="category-management">
      <div className="category-header">
        <h1 className="category-title">Category Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          disabled={showForm}
        >
          • Add Category
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Category Form */}
      {showForm && (
        <div className="category-form-container">
          <div className="category-form-card">
            <div className="form-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={handleCancel} className="btn-close"></button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter category name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Enter category description (optional)"
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !formData.name.trim()}
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="categories-list">
        {categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-content">
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                    <div className="category-meta">
                      <span className="category-id">ID: {category.id}</span>
                      {category.created_at && (
                        <span className="category-date">
                          Created: {new Date(category.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-outline btn-sm"
                      disabled={showForm}
                    >
                       Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="btn btn-danger btn-sm"
                      disabled={showForm}
                    >
                      =Ñ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">=Â</div>
            <h3>No Categories Found</h3>
            <p>Start by creating your first product category.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              disabled={showForm}
            >
              Add First Category
            </button>
          </div>
        )}
      </div>

      {/* Categories Summary */}
      {categories.length > 0 && (
        <div className="categories-summary">
          <div className="summary-card">
            <div className="summary-stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Total Categories</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;