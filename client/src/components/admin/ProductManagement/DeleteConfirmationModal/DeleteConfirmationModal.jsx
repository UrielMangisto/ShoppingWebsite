import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ 
  product, 
  onConfirm, 
  onCancel, 
  loading 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete "<strong>{product.name}</strong>"?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onConfirm(product.id)}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
