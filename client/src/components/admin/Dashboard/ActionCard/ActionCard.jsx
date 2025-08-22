import React from 'react';
import './ActionCard.css';

const ActionCard = ({ icon, title, description, onClick }) => {
  return (
    <button className="action-card" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
};

export default ActionCard;
