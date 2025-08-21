// src/pages/admin/CategoryManagement/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCategories } from '../../../hooks/useCategories';
import { useApi } from '../../../hooks/useApi';
import { categoriesService } from '../../../services/categoriesService';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { categories, loading, refetch } = useCategories();
  const { loading: apiLoading, execute } = useApi();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await execute(() => categoriesService.updateCategory(editingCategory.id, formData.name.trim()));
        alert('Category updated successfully!');
      } else {
        await execute(() => categoriesService.createCategory(formData.name.trim()));
        alert('Category created successfully!');
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '' });
      await refetch(); // Refresh categories list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await execute(() => categoriesService.deleteCategory(categoryId));
      alert('Category deleted successfully!');
      setDeleteConfirm(null);
      await refetch(); // Refresh categories list
    } catch (error) {
      alert(`Error deleting category: ${error.message}`);
    }
  };

  const confirmDelete = (category) => {
    setDeleteConfirm(category);
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

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Category Management</h1>
            <p>Organize your product categories</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateCategory}
          >
            Add New Category
          </button>
        </div>

        {/* Category Stats */}
        <div className="category-stats">
          <div className="stat-card">
            <div className="stat-number">{categories.length}</div>
            <div className="stat-label">Total Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filteredCategories.length}</div>
            <div className="stat-label">Filtered Results</div>
          </div>
        </div>

        <div className="management-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="categories-container">
            {filteredCategories.length > 0 ? (
              <div className="categories-grid">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="category-card">
                    <div className="category-header">
                      <h3>{category.name}</h3>
                      <span className="category-id">ID: {category.id}</span>
                    </div>
                    <div className="category-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmDelete(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-categories">
                <div className="empty-state">
                  <div className="empty-icon">🏷️</div>
                  <h3>{searchTerm ? 'No matching categories' : 'No categories yet'}</h3>
                  <p>
                    {searchTerm 
                      ? 'Try adjusting your search terms.' 
                      : 'Start organizing your products by creating categories.'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      className="btn btn-primary"
                      onClick={handleCreateCategory}
                    >
                      Create First Category
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="category-name">Category Name *</label>
                    <input
                      type="text"
                      id="category-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      placeholder="Enter category name"
                      className="form-input"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleFormCancel}
                    disabled={apiLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={apiLoading || !formData.name.trim()}
                  >
                    {apiLoading 
                      ? (editingCategory ? 'Updating...' : 'Creating...') 
                      : (editingCategory ? 'Update Category' : 'Create Category')
                    }
                  </button>
                </div>
              </form>
            </div>
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
                <p>Are you sure you want to delete the category "<strong>{deleteConfirm.name}</strong>"?</p>
                <p className="warning-text">
                  ⚠️ This action cannot be undone. Products in this category will become uncategorized.
                </p>
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
                  onClick={() => handleDeleteCategory(deleteConfirm.id)}
                  disabled={apiLoading}
                >
                  {apiLoading ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;

