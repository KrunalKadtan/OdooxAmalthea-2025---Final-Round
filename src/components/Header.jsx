import React from 'react';
import './Header.css';

function Header({ userName, userRole }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="notification-btn">
          <span className="bell-icon">🔔</span>
          <span className="notification-dot"></span>
        </button>

        <div className="user-section">
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <span className="user-role">{userRole}</span>
          </div>
          <div className="user-avatar">
            {getInitials(userName)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
