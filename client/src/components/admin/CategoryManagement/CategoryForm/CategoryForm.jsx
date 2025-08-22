import React from 'react';
import './CategoryForm.css';

const CategoryForm = ({ 
  category, 
  formData, 
  onSubmit, 
  onCancel, 
  onChange,
  loading 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{category ? 'Edit Category' : 'Add New Category'}</h3>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="category-name">Category Name *</label>
              <input
                type="text"
                id="category-name"
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
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
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.name.trim()}
            >
              {loading 
                ? (category ? 'Updating...' : 'Creating...') 
                : (category ? 'Update Category' : 'Create Category')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
