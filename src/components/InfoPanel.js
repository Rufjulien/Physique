import React from 'react';

function InfoPanel({ title, text }) {
  return (
    <div className="info-panel">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default InfoPanel;
