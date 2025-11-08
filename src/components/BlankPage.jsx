import React from 'react';
import './BlankPage.css';

function BlankPage({ title, subtitle }) {
  return (
    <div className="blank-page">
      <div className="blank-content">
        <div className="blank-icon">📄</div>
        <h2 className="blank-title">{title}</h2>
        <p className="blank-subtitle">{subtitle || 'This page is under construction'}</p>
      </div>
    </div>
  );
}

export default BlankPage;
