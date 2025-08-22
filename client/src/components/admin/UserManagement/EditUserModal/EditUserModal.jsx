import React from 'react';
import './EditUserModal.css';

const EditUserModal = ({ user, onUpdate, onCancel, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit User</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-name">Name</label>
              <input
                type="text"
                id="edit-name"
                value={user.name}
                onChange={(e) => onUpdate({ ...user, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                type="email"
                id="edit-email"
                value={user.email}
                onChange={(e) => onUpdate({ ...user, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <div className="role-display">
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
                <small>Role changes require database access</small>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
