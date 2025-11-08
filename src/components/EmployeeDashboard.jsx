import { useState } from "react";
import "./EmployeeDashboard.css";

function EmployeeDashboard({ userName }) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const leaveStatus = {
    totalAnnualLeave: 20,
    used: 10,
    remaining: 10,
    pendingRequests: 2,
    approvedLeaves: 8,
  };

  const recentPayslips = [
    { month: "October 2025", amount: "$5,250", date: "2025-10-31" },
    { month: "September 2025", amount: "$5,250", date: "2025-09-30" },
    { month: "August 2025", amount: "$5,250", date: "2025-08-31" },
  ];

  const handleMarkAttendance = () => {
    alert("Attendance marked successfully!");
  };

  const handleDownloadPayslip = (month) => {
    alert(`Downloading payslip for ${month}`);
  };

  return (
    <div className="employee-dashboard">
      {/* Greeting Section */}
      <div className="greeting-section">
        <div className="greeting-icon">🌅</div>
        <div className="greeting-content">
          <h1 className="greeting-title">
            {greeting}, {userName}!
          </h1>
          <p className="greeting-subtitle">
            Welcome back to WorkZen. Here's your overview for today.
          </p>
        </div>
      </div>

      {/* Quick Action Card */}
      <div className="quick-action-card">
        <div className="quick-action-header">
          <h3 className="quick-action-title">Quick Action</h3>
        </div>
        <p className="quick-action-subtitle">Mark your attendance for today</p>
        <button className="btn-mark-attendance" onClick={handleMarkAttendance}>
          <span className="btn-icon">⊙</span>
          Mark My Attendance
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Leave Status Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-header-content">
              <h3 className="card-title">My Leave Status</h3>
              <p className="card-subtitle">Your time-off balance and requests</p>
            </div>
            <div className="card-icon">🕐</div>
          </div>
          <div className="card-content">
            <div className="leave-stats">
              <div className="stat-row">
                <span className="stat-label">Total Annual Leave</span>
                <span className="stat-value">{leaveStatus.totalAnnualLeave} days</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Used</span>
                <span className="stat-value">{leaveStatus.used} days</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Remaining</span>
                <span className="stat-value stat-primary">
                  {leaveStatus.remaining} days
                </span>
              </div>
            </div>

            <div className="leave-requests">
              <div className="request-row">
                <span className="request-label">Pending Requests</span>
                <span className="badge badge-yellow">
                  {leaveStatus.pendingRequests} pending
                </span>
              </div>
              <div className="request-row">
                <span className="request-label">Approved Leaves</span>
                <span className="badge badge-green">
                  {leaveStatus.approvedLeaves} approved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payslips Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-header-content">
              <h3 className="card-title">My Recent Payslips</h3>
              <p className="card-subtitle">Download your salary statements</p>
            </div>
            <div className="card-icon">📄</div>
          </div>
          <div className="card-content">
            <div className="payslips-list">
              {recentPayslips.map((payslip, index) => (
                <div key={index} className="payslip-item">
                  <div className="payslip-info">
                    <p className="payslip-month">{payslip.month}</p>
                    <p className="payslip-date">{payslip.date}</p>
                  </div>
                  <div className="payslip-actions">
                    <p className="payslip-amount">{payslip.amount}</p>
                    <button
                      className="btn-download"
                      onClick={() => handleDownloadPayslip(payslip.month)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
