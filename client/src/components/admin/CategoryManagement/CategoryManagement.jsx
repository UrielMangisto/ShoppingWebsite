import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { categoriesService } from '../../../services/categoriesService';
import CategoryForm from '../../categories/CategoryForm/CategoryForm';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { success, data } = await execute(categoriesService.getCategories);
    if (success) {
      setCategories(data);
    }
  };

  const handleAdd = async (formData) => {
    const { success, data } = await execute(() => 
      categoriesService.createCategory(formData)
    );
    if (success) {
      setCategories([...categories, data]);
    }
  };

  const handleUpdate = async (formData) => {
    const { success, data } = await execute(() => 
      categoriesService.updateCategory(editingCategory._id, formData)
    );
    if (success) {
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id ? data : cat
      ));
      setEditingCategory(null);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const { success } = await execute(() => 
        categoriesService.deleteCategory(categoryId)
      );
      if (success) {
        setCategories(categories.filter(cat => cat._id !== categoryId));
      }
    }
  };

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>
      {error && <div className="error-message">{error}</div>}

      <CategoryForm
        category={editingCategory}
        onSubmit={editingCategory ? handleUpdate : handleAdd}
        onCancel={() => setEditingCategory(null)}
      />

      <div className="categories-list">
        {categories.map(category => (
          <div key={category._id} className="category-item">
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="category-actions">
              <button onClick={() => setEditingCategory(category)}>
                Edit
              </button>
              <button onClick={() => handleDelete(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;