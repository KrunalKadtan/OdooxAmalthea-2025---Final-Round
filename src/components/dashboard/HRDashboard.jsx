import React from "react";
import { UserPlus, Users, Calendar, Briefcase } from "lucide-react";
import "./HRDashboard.css";

function HRDashboard({ onNavigate }) {
  const newHires = [
    {
      name: "Alice Cooper",
      position: "UI/UX Designer",
      department: "Design",
      startDate: "Nov 1, 2025",
    },
    {
      name: "Robert Chen",
      position: "Data Analyst",
      department: "Analytics",
      startDate: "Nov 5, 2025",
    },
    {
      name: "Maria Garcia",
      position: "Marketing Manager",
      department: "Marketing",
      startDate: "Nov 8, 2025",
    },
  ];

  const attendanceRecords = [
    {
      id: "WZ-001",
      name: "Sarah Johnson",
      department: "Engineering",
      status: "Present",
      time: "09:15 AM",
    },
    {
      id: "WZ-002",
      name: "Michael Brown",
      department: "Sales",
      status: "Present",
      time: "08:45 AM",
    },
    {
      id: "WZ-003",
      name: "Emma Wilson",
      department: "Marketing",
      status: "Absent",
      time: "-",
    },
    {
      id: "WZ-004",
      name: "David Lee",
      department: "Finance",
      status: "Present",
      time: "09:00 AM",
    },
    {
      id: "WZ-005",
      name: "Lisa Anderson",
      department: "HR",
      status: "Present",
      time: "08:55 AM",
    },
  ];

  const leaveAllocation = {
    totalEmployees: 118,
    totalLeaveDays: 2360,
    usedLeaveDays: 1240,
    remainingLeaveDays: 1120,
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">HR Officer Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your workforce and employee records
          </p>
        </div>
        <button
          className="btn-create-employee"
          onClick={() => onNavigate("employee-directory")}
        >
          <UserPlus className="btn-icon" />
          Create New Employee Profile
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Employees</p>
              <h2 className="stat-value">{leaveAllocation.totalEmployees}</h2>
            </div>
            <Users className="stat-icon primary" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">New Hires This Month</p>
              <h2 className="stat-value">{newHires.length}</h2>
            </div>
            <UserPlus className="stat-icon green" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Leaves Allocated</p>
              <h2 className="stat-value">{leaveAllocation.totalLeaveDays}</h2>
            </div>
            <Calendar className="stat-icon yellow" />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">New Hires This Month</h3>
            <p className="card-description">Recently onboarded employees</p>
          </div>
          <button className="btn-outline-sm">View All</button>
        </div>
        <div className="card-content">
          <div className="hires-list">
            {newHires.map((hire, index) => (
              <div key={index} className="hire-item">
                <div className="hire-info">
                  <div className="hire-avatar">
                    <Briefcase className="hire-icon" />
                  </div>
                  <div>
                    <p className="hire-name">{hire.name}</p>
                    <p className="hire-details">
                      {hire.position} • {hire.department}
                    </p>
                  </div>
                </div>
                <div className="hire-date">
                  <span className="badge badge-green">{hire.startDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Employee Attendance Monitoring</h3>
            <p className="card-description">
              Real-time attendance tracking for today
            </p>
          </div>
        </div>
        <div className="card-content">
          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.department}</td>
                    <td>
                      <span
                        className={`badge ${
                          record.status === "Present"
                            ? "badge-green"
                            : "badge-red"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>{record.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Leave Allocation Summary</h3>
            <p className="card-description">
              Organization-wide leave statistics
            </p>
          </div>
        </div>
        <div className="card-content">
          <div className="leave-stats-grid">
            <div className="leave-stat-item">
              <p className="leave-stat-label">Total Leave Days</p>
              <h3 className="leave-stat-value">
                {leaveAllocation.totalLeaveDays}
              </h3>
            </div>
            <div className="leave-stat-item">
              <p className="leave-stat-label">Used</p>
              <h3 className="leave-stat-value red">
                {leaveAllocation.usedLeaveDays}
              </h3>
            </div>
            <div className="leave-stat-item">
              <p className="leave-stat-label">Remaining</p>
              <h3 className="leave-stat-value green">
                {leaveAllocation.remainingLeaveDays}
              </h3>
            </div>
            <div className="leave-stat-item">
              <p className="leave-stat-label">Utilization</p>
              <h3 className="leave-stat-value primary">
                {Math.round(
                  (leaveAllocation.usedLeaveDays /
                    leaveAllocation.totalLeaveDays) *
                    100
                )}
                %
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
