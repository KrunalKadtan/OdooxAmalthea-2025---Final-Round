import React from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
} from "lucide-react";
import "./PayrollDashboard.css";

function PayrollDashboard({ onNavigate }) {
  const stats = [
    {
      label: "Total Payroll",
      value: "₹5,90,000",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "blue",
    },
    {
      label: "Employees Paid",
      value: "118",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      label: "Pending Payslips",
      value: "5",
      change: "-2",
      trend: "down",
      icon: FileText,
      color: "yellow",
    },
    {
      label: "Average Salary",
      value: "₹50,000",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const recentPayruns = [
    {
      period: "December 2025",
      employees: 118,
      totalAmount: "₹5,90,000",
      status: "Pending",
      date: "2025-12-01",
    },
    {
      period: "November 2025",
      employees: 118,
      totalAmount: "₹5,90,000",
      status: "Completed",
      date: "2025-11-01",
    },
    {
      period: "October 2025",
      employees: 115,
      totalAmount: "₹5,75,000",
      status: "Completed",
      date: "2025-10-01",
    },
  ];

  const upcomingPayments = [
    {
      title: "Monthly Salary - December",
      dueDate: "Dec 30, 2025",
      amount: "₹5,90,000",
      employees: 118,
    },
    {
      title: "Performance Bonus - Q4",
      dueDate: "Dec 31, 2025",
      amount: "₹2,50,000",
      employees: 85,
    },
    {
      title: "Year-End Bonus",
      dueDate: "Jan 5, 2026",
      amount: "₹3,00,000",
      employees: 118,
    },
  ];

  const salaryBreakdown = [
    { component: "Basic Salary", amount: "₹2,95,000", percentage: 50 },
    { component: "HRA", amount: "₹1,47,500", percentage: 25 },
    { component: "Allowances", amount: "₹88,500", percentage: 15 },
    { component: "Bonuses", amount: "₹58,000", percentage: 10 },
  ];

  const quickActions = [
    {
      title: "Process Payroll",
      description: "Generate payslips for current month",
      icon: DollarSign,
      color: "blue",
      link: "payroll",
    },
    {
      title: "View Reports",
      description: "Access salary and tax reports",
      icon: FileText,
      color: "purple",
      link: "reports",
    },
    {
      title: "Attendance",
      description: "Review attendance for payroll",
      icon: Calendar,
      color: "yellow",
      link: "attendance",
    },
    {
      title: "Time Off",
      description: "Manage leave requests",
      icon: ClipboardList,
      color: "green",
      link: "time-off",
    },
  ];

  return (
    <div className="payroll-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Payroll Officer Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage payroll and employee compensation
          </p>
        </div>
        <button
          className="btn-process-payroll"
          onClick={() => onNavigate("payroll")}
        >
          <DollarSign className="btn-icon" />
          Process Payroll
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <h2 className="stat-value">{stat.value}</h2>
                  <div className={`stat-change ${stat.trend}`}>
                    <span>{stat.change} from last month</span>
                  </div>
                </div>
                <div className={`stat-icon-wrapper ${stat.color}`}>
                  <Icon className="stat-icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Payruns */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Payruns</h3>
              <p className="card-description">Latest payroll processing history</p>
            </div>
            <button
              className="btn-view-all"
              onClick={() => onNavigate("payroll")}
            >
              View All
            </button>
          </div>
          <div className="card-content">
            <div className="payruns-list">
              {recentPayruns.map((payrun, index) => (
                <div key={index} className="payrun-item">
                  <div className="payrun-info">
                    <h4 className="payrun-period">{payrun.period}</h4>
                    <p className="payrun-details">
                      {payrun.employees} employees • {payrun.totalAmount}
                    </p>
                  </div>
                  <div className="payrun-status-wrapper">
                    <span
                      className={`payrun-status ${
                        payrun.status === "Completed" ? "completed" : "pending"
                      }`}
                    >
                      {payrun.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Upcoming Payments</h3>
              <p className="card-description">Scheduled payments and bonuses</p>
            </div>
          </div>
          <div className="card-content">
            <div className="payments-list">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="payment-item">
                  <div className="payment-icon">
                    <AlertCircle className="icon" />
                  </div>
                  <div className="payment-info">
                    <h4 className="payment-title">{payment.title}</h4>
                    <p className="payment-details">
                      {payment.employees} employees • Due: {payment.dueDate}
                    </p>
                  </div>
                  <div className="payment-amount">{payment.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Salary Breakdown</h3>
            <p className="card-description">
              Current month salary component distribution
            </p>
          </div>
        </div>
        <div className="card-content">
          <div className="breakdown-grid">
            {salaryBreakdown.map((item, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">{item.component}</span>
                  <span className="breakdown-percentage">
                    {item.percentage}%
                  </span>
                </div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="breakdown-amount">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="quick-action-card"
                onClick={() => onNavigate(action.link)}
              >
                <div className={`quick-action-icon-wrapper ${action.color}`}>
                  <Icon className="quick-action-icon" />
                </div>
                <div className="quick-action-text">
                  <h3 className="quick-action-title">{action.title}</h3>
                  <p className="quick-action-description">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PayrollDashboard;
