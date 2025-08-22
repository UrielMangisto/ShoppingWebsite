import React from 'react';
import './UserStats.css';

const UserStats = ({ totalUsers, adminUsers, regularUsers }) => {
  return (
    <div className="user-stats">
      <div className="stat-card">
        <div className="stat-number">{totalUsers}</div>
        <div className="stat-label">Total Users</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{adminUsers}</div>
        <div className="stat-label">Administrators</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{regularUsers}</div>
        <div className="stat-label">Regular Users</div>
      </div>
    </div>
  );
};

export default UserStats;
