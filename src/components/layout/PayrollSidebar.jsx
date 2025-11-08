import React from "react";
import {
  Home,
  DollarSign,
  Calendar,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react";
import "./Sidebar.css";

function PayrollSidebar({ currentView, onNavigate }) {
  const menuItems = [
    {
      id: "payroll-dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Calendar,
    },
    {
      id: "time-off",
      label: "Time Off",
      icon: FileText,
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: DollarSign,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="sidebar">
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
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default PayrollSidebar;
