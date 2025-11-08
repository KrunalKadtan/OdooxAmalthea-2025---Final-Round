import React from "react";
import {
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar({ currentView, onNavigate }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "employees", label: "Employees", icon: Users },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "time-off", label: "Time Off", icon: FileText },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Building2 className="logo-icon" />
          <div className="logo-content">
            <h1 className="logo-text">WorkZen</h1>
            <p className="logo-subtitle">HRMS Platform</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="nav-icon" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
