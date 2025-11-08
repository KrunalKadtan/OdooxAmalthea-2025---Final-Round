import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from "../common";
import { Sunrise, CheckCircle2, Clock, FileText } from "lucide-react";
import "./EmployeeDashboard.css";

function EmployeeDashboard({ userName = "Sarah Johnson", onNavigate }) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const leaveStatus = {
    pending: 2,
    approved: 8,
    total: 20,
    used: 10,
    remaining: 10,
  };

  const recentPayslips = [
    { month: "October 2025", amount: "$5,250", date: "2025-10-31" },
    { month: "September 2025", amount: "$5,250", date: "2025-09-30" },
    { month: "August 2025", amount: "$5,250", date: "2025-08-31" },
  ];

  const handleMarkAttendance = () => {
    if (onNavigate) {
      onNavigate("attendance");
    }
  };

  const handleDownloadPayslip = (month) => {
    alert(`Downloading payslip for ${month}`);
  };

  return (
    <div className="employee-dashboard">
      {/* Greeting Section */}
      <div className="greeting-section">
        <Sunrise className="greeting-icon-svg" />
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
        <h2 className="quick-action-title">Quick Action</h2>
        <p className="quick-action-subtitle">Mark your attendance for today</p>
        <Button
          size="large"
          className="btn-mark-attendance"
          onClick={handleMarkAttendance}
        >
          <CheckCircle2 className="btn-icon-svg" />
          Mark My Attendance
        </Button>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Leave Status Card */}
        <Card className="dashboard-card leave-status-card">
          <CardHeader className="leave-status-header">
            <div className="leave-header-top">
              <CardTitle className="leave-title">My Leave Status</CardTitle>
              <Clock className="leave-clock-icon" />
            </div>
            <CardDescription className="leave-description">
              Your time-off balance and requests
            </CardDescription>
          </CardHeader>
          <CardContent className="leave-content">
            <div className="leave-stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Annual Leave</span>
                <span className="stat-value">{leaveStatus.total} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Used</span>
                <span className="stat-value">{leaveStatus.used} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Remaining</span>
                <span className="stat-value stat-primary">
                  {leaveStatus.remaining} days
                </span>
              </div>
            </div>

            <div className="leave-separator-line"></div>

            <div className="leave-requests-section">
              <div className="request-item">
                <span className="request-label">Pending Requests</span>
                <Badge variant="warning" className="badge-pending">
                  {leaveStatus.pending} pending
                </Badge>
              </div>
              <div className="request-item">
                <span className="request-label">Approved Leaves</span>
                <Badge variant="success" className="badge-approved">
                  {leaveStatus.approved} approved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payslips Card */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="card-header-with-icon">
              <CardTitle>My Recent Payslips</CardTitle>
              <FileText className="card-icon-svg" />
            </div>
            <CardDescription>Download your salary statements</CardDescription>
          </CardHeader>
          <CardContent>
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
                      className="btn-download-link"
                      onClick={() => handleDownloadPayslip(payslip.month)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
