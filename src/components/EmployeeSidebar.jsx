import React from 'react';
import './EmployeeSidebar.css';

function EmployeeSidebar({ currentView, onNavigate }) {
  const menuItems = [
    { id: 'employee-dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'attendance', label: 'My Attendance', icon: '📅' },
    { id: 'time-off', label: 'Time Off', icon: '📋' },
  ];

  return (
    <div className="employee-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">🏢</div>
          <div>
            <h1 className="logo-text">WorkZen</h1>
            <p className="logo-subtitle">HRMS Platform</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default EmployeeSidebar;
