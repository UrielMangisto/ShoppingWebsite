import React from 'react';
import './UserSearch.css';

const UserSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="management-controls">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default UserSearch;
