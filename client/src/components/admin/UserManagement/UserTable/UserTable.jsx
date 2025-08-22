import React from 'react';
import './UserTable.css';

const UserTable = ({ users, currentUser, onEditUser, onDeleteUser, formatDate }) => {
  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-name-cell">
                    <strong>{u.name}</strong>
                    <span>ID: {u.id}</span>
                  </div>
                </td>
                <td className="email-cell">{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edituser"
                      onClick={() => onEditUser(u)}
                      disabled={u.id === currentUser?.id}
                      title={u.id === currentUser?.id ? "Can't edit yourself" : "Edit user"}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteuser"
                      onClick={() => onDeleteUser(u)}
                      disabled={u.id === currentUser?.id || u.role === 'admin'}
                      title={
                        u.id === currentUser?.id ? "Can't delete yourself" :
                        u.role === 'admin' ? "Can't delete admin users" : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
