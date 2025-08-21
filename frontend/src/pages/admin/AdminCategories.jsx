import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar/AdminSidebar';
import CategoryList from '../../components/admin/CategoryManagement/CategoryList';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import ConfirmationModal from '../../components/common/ConfirmationModal/ConfirmationModal';
import './AdminCategories.css';

const AdminCategories = () => {
  const { categories, fetchCategories, deleteCategory } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        await fetchCategories();
      } catch (err) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [fetchCategories]);

  const handleSelect = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedCategories(
      event.target.checked
        ? categories.map(category => category._id)
        : []
    );
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      } catch (err) {
        setError(err.message || 'Failed to delete category');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
      try {
        await Promise.all(selectedCategories.map(id => deleteCategory(id)));
        setSelectedCategories([]);
      } catch (err) {
        setError(err.message || 'Failed to delete categories');
      }
    }
  };

  const handleDeleteClick = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    if (category.productsCount > 0) {
      setError('Cannot delete category with associated products');
      return;
    }
    setCategoryToDelete(categoryId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (categoryToDelete) {
        await deleteCategory(categoryToDelete);
        setSelectedCategories(prev => prev.filter(id => id !== categoryToDelete));
      } else if (selectedCategories.length > 0) {
        const categoriesToDelete = selectedCategories.filter(id => 
          !categories.find(c => c._id === id && c.productsCount > 0)
        );
        if (categoriesToDelete.length === 0) {
          setError('No categories can be deleted - they all have associated products');
          return;
        }
        await Promise.all(categoriesToDelete.map(id => deleteCategory(id)));
        setSelectedCategories([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete category(ies)');
    } finally {
      setShowConfirmModal(false);
      setCategoryToDelete(null);
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
            <header className="categories-header">
              <h1>Categories Management</h1>
              <div className="header-actions">
                <Link to="/admin/categories/new" className="add-category-button">
                  Add New Category
                </Link>
                {selectedCategories.length > 0 && (
                  <button 
                    className="bulk-delete-button"
                    onClick={() => {
                      setCategoryToDelete(null);
                      setShowConfirmModal(true);
                    }}
                  >
                    Delete Selected ({selectedCategories.length})
                  </button>
                )}
              </div>
            </header>

            <CategoryList
              categories={categories}
              selectedCategories={selectedCategories}
              onSelectAll={handleSelectAll}
              onSelect={handleSelect}
              onDeleteClick={handleDeleteClick}
            />

            {showConfirmModal && (
              <ConfirmationModal
                isOpen={showConfirmModal}
                title="Confirm Delete"
                message={categoryToDelete 
                  ? "Are you sure you want to delete this category?" 
                  : `Are you sure you want to delete the selected categories? Only categories without products will be deleted.`
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                  setShowConfirmModal(false);
                  setCategoryToDelete(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
