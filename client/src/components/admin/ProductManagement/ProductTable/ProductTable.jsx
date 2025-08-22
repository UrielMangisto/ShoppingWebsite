import React from 'react';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete, formatDate }) => {
  return (
    <div className="table-container">
      <table className="responsive-table">
        <caption className="table-caption">Product Management</caption>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td data-cell="Image">
                  <div className="product-image-cell">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className="no-image">📷</div>
                    )}
                  </div>
                </td>
                <td data-cell="Name">
                  <div className="product-name-cell">
                    <strong>{product.name}</strong>
                    <span>{product.description.substring(0, 50)}...</span>
                  </div>
                </td>
                <td data-cell="Category">{product.category_name || 'Uncategorized'}</td>
                <td data-cell="Price" className="price-cell">${product.price}</td>
                <td data-cell="Stock" className={`stock-cell ${product.stock <= 5 ? 'low-stock' : ''}`}>
                  {product.stock}
                </td>
                <td data-cell="Rating">
                  {product.average_rating ? (
                    <div className="rating-cell">
                      <span>⭐ {parseFloat(product.average_rating).toFixed(1)}</span>
                      <small>({product.review_count})</small>
                    </div>
                  ) : (
                    <span className="no-rating">No reviews</span>
                  )}
                </td>
                <td data-cell="Created">{formatDate(product.created_at)}</td>
                <td data-cell="Actions">
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(product)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;