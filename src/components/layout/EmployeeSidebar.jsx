import React from "react";
import {
  Home,
  UserCircle,
  Calendar,
  FileText,
  Users,
  Building2,
} from "lucide-react";
import "./EmployeeSidebar.css";

function EmployeeSidebar({ currentView, onNavigate }) {
  const menuItems = [
    { id: "employee-dashboard", label: "Dashboard", icon: Home },
    { id: "employee-directory", label: "Employees", icon: Users },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "time-off", label: "Time Off", icon: FileText },
    { id: "profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <div className="employee-sidebar">
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

export default EmployeeSidebar;
