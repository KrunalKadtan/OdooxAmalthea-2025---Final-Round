import { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onNavigate }) {
  const departmentData = [
    { name: "Engineering", employees: 45 },
    { name: "Sales", employees: 28 },
    { name: "Marketing", employees: 18 },
    { name: "HR", employees: 12 },
    { name: "Finance", employees: 15 },
  ];

  const attendanceData = [
    { name: "Present", value: 108, color: "#16a34a" },
    { name: "Absent", value: 10, color: "#dc2626" },
  ];

  const stats = [
    {
      label: "Total Employees",
      value: "118",
      icon: "👥",
      color: "stat-primary",
      link: "employees",
    },
    {
      label: "Present Today",
      value: "108",
      icon: "✓",
      color: "stat-green",
      link: "attendance",
    },
    {
      label: "Absent Today",
      value: "10",
      icon: "✗",
      color: "stat-red",
      link: "attendance",
    },
    {
      label: "Pending Leaves",
      value: "15",
      icon: "📋",
      color: "stat-yellow",
      link: "time-off",
    },
  ];

  const leaveRequests = [
    {
      name: "John Martinez",
      dates: "Nov 15-17, 2025",
      type: "Sick Leave",
      days: 3,
    },
    {
      name: "Emma Wilson",
      dates: "Nov 20-22, 2025",
      type: "Vacation",
      days: 3,
    },
    {
      name: "Michael Brown",
      dates: "Nov 25, 2025",
      type: "Personal",
      days: 1,
    },
  ];

  const quickActions = [
    {
      title: "Manage Employees",
      description: "View and edit employee profiles",
      icon: "👥",
      color: "action-primary",
      link: "employees",
    },
    {
      title: "Attendance",
      description: "Track employee attendance",
      icon: "📅",
      color: "action-green",
      link: "attendance",
    },
    {
      title: "Payroll",
      description: "Manage payroll and payslips",
      icon: "💰",
      color: "action-blue",
      link: "payroll",
    },
    {
      title: "Reports",
      description: "Generate salary reports",
      icon: "📄",
      color: "action-purple",
      link: "reports",
    },
    {
      title: "Time Off",
      description: "Manage leave requests",
      icon: "📋",
      color: "action-yellow",
      link: "time-off",
    },
    {
      title: "Settings",
      description: "Configure HRMS preferences",
      icon: "⚙️",
      color: "action-gray",
      link: "settings",
    },
  ];

  const getMaxValue = (data) => {
    return Math.max(...data.map((item) => item.employees));
  };

  const maxEmployees = getMaxValue(departmentData);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Administrator Dashboard</h1>
        <p className="dashboard-description">
          Complete overview of your organization
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${stat.color}`}
            onClick={() => onNavigate(stat.link)}
          >
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Department Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Employees by Department</h3>
            <p className="chart-subtitle">Distribution across all departments</p>
          </div>
          <div className="chart-content">
            <div className="bar-chart">
              {departmentData.map((dept, index) => (
                <div key={index} className="bar-wrapper">
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{
                        height: `${(dept.employees / maxEmployees) * 100}%`,
                      }}
                    >
                      <span className="bar-value">{dept.employees}</span>
                    </div>
                  </div>
                  <span className="bar-label">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Attendance Today</h3>
            <p className="chart-subtitle">Current day attendance status</p>
          </div>
          <div className="chart-content">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="pie-svg">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="40"
                  strokeDasharray={`${
                    (attendanceData[0].value /
                      (attendanceData[0].value + attendanceData[1].value)) *
                    502.4
                  } 502.4`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="40"
                  strokeDasharray={`${
                    (attendanceData[1].value /
                      (attendanceData[0].value + attendanceData[1].value)) *
                    502.4
                  } 502.4`}
                  strokeDashoffset={`-${
                    (attendanceData[0].value /
                      (attendanceData[0].value + attendanceData[1].value)) *
                    502.4
                  }`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="pie-legend">
                {attendanceData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="legend-text">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="leave-requests-card">
        <div className="card-header">
          <h3 className="card-title">Pending Leave Requests</h3>
          <p className="card-subtitle">Requests awaiting approval</p>
        </div>
        <div className="card-content">
          <div className="leave-requests-list">
            {leaveRequests.map((request, index) => (
              <div key={index} className="leave-request-item">
                <div className="request-info">
                  <p className="request-name">{request.name}</p>
                  <p className="request-details">
                    {request.dates} • {request.type} • {request.days} days
                  </p>
                </div>
                <button
                  className="btn-review"
                  onClick={() => onNavigate("time-off")}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className={`quick-action-card ${action.color}`}
            onClick={() => onNavigate(action.link)}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
