import React from 'react';
import './Sidebar.css';

function Sidebar({ currentView, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📅' },
    { id: 'time-off', label: 'Time Off', icon: '📋' },
    { id: 'payroll', label: 'Payroll', icon: '💰' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="sidebar">
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

      <div className="sidebar-footer">
        <button className="logout-btn">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
