import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CategoryList.css';

const CategoryList = ({
  categories,
  selectedCategories,
  onSelectAll,
  onSelect,
  onDeleteClick
}) => {
  return (
    <div className="categories-table-container">
      <table className="categories-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e)}
                checked={selectedCategories.length === categories.length && categories.length > 0}
              />
            </th>
            <th>Name</th>
            <th>Description</th>
            <th>Products Count</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => onSelect(category._id)}
                />
              </td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>{category.productsCount}</td>
              <td>{new Date(category.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                <Link
                  to={`/admin/categories/edit/${category._id}`}
                  className="edit-button"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDeleteClick(category._id)}
                  className="delete-button"
                  disabled={category.productsCount > 0}
                  title={category.productsCount > 0 ? "Can't delete category with products" : "Delete category"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      productsCount: PropTypes.number,
      createdAt: PropTypes.string
    })
  ).isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default CategoryList;
