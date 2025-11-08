import React from "react";
import {
  LayoutDashboard,
  DollarSign,
  Calendar,
  ClipboardList,
  FileText,
} from "lucide-react";
import "./Sidebar.css";

function PayrollSidebar({ currentView, onNavigate }) {
  const menuItems = [
    {
      id: "payroll-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: DollarSign,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Calendar,
    },
    {
      id: "time-off",
      label: "Time Off",
      icon: ClipboardList,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <svg
            className="logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="logo-text">WorkZen</span>
        </div>
        <div className="portal-badge payroll">Payroll Portal</div>
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
