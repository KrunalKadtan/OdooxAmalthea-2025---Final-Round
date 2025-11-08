import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

function Header({ userName, userRole, onNavigate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(false);
    onNavigate('profile');
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="notification-btn">
          <span className="bell-icon">🔔</span>
          <span className="notification-dot"></span>
        </button>

        <div className="user-section" ref={dropdownRef}>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <span className="user-role">{userRole}</span>
          </div>
          <div 
            className="user-avatar clickable" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials(userName)}
          </div>

          {showDropdown && (
            <div className="user-dropdown">
              <button className="dropdown-item" onClick={handleProfileClick}>
                <span className="dropdown-icon">👤</span>
                My Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
