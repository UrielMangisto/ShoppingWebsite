import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ userName }) => {
  return (
    <div className="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p>Welcome back, {userName}!</p>
    </div>
  );
};

export default DashboardHeader;
