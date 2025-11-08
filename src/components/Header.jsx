import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

function Header({ userName, userRole, onNavigate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    window.location.reload();
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
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
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                <span className="dropdown-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3 className="dialog-title">Confirm Logout</h3>
            </div>
            <div className="dialog-content">
              <p className="dialog-message">
                Are you sure you want to logout? You will need to login again to access the system.
              </p>
            </div>
            <div className="dialog-actions">
              <button className="dialog-btn btn-cancel" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="dialog-btn btn-confirm" onClick={handleLogoutConfirm}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
