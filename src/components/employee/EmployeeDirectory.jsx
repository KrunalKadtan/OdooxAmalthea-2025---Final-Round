import React, { useState } from "react";
import { Search, Plane } from "lucide-react";
import "./EmployeeDirectory.css";

function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employees] = useState([
    {
      id: "WZ-1234",
      name: "Sarah Johnson",
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      email: "sarah.j@workzen.com",
      phone: "+91 98765 43210",
      joinDate: "2023-01-15",
      attendanceStatus: "present",
      checkInTime: "09:00 AM",
    },
    {
      id: "WZ-1235",
      name: "Michael Brown",
      jobTitle: "Sales Manager",
      department: "Sales",
      email: "michael.b@workzen.com",
      phone: "+91 98765 43211",
      joinDate: "2023-02-20",
      attendanceStatus: "on-leave",
    },
    {
      id: "WZ-1236",
      name: "Emma Wilson",
      jobTitle: "Marketing Specialist",
      department: "Marketing",
      email: "emma.w@workzen.com",
      phone: "+91 98765 43212",
      joinDate: "2023-03-10",
      attendanceStatus: "present",
      checkInTime: "08:45 AM",
    },
    {
      id: "WZ-1237",
      name: "David Lee",
      jobTitle: "Financial Analyst",
      department: "Finance",
      email: "david.l@workzen.com",
      phone: "+91 98765 43213",
      joinDate: "2023-04-05",
      attendanceStatus: "absent",
    },
    {
      id: "WZ-1238",
      name: "Lisa Anderson",
      jobTitle: "HR Manager",
      department: "HR",
      email: "lisa.a@workzen.com",
      phone: "+91 98765 43214",
      joinDate: "2022-12-01",
      attendanceStatus: "present",
      checkInTime: "09:15 AM",
    },
    {
      id: "WZ-1239",
      name: "John Martinez",
      jobTitle: "Product Designer",
      department: "Design",
      email: "john.m@workzen.com",
      phone: "+91 98765 43215",
      joinDate: "2023-05-15",
      attendanceStatus: "present",
      checkInTime: "09:30 AM",
    },
    {
      id: "WZ-1240",
      name: "Anna Taylor",
      jobTitle: "Backend Developer",
      department: "Engineering",
      email: "anna.t@workzen.com",
      phone: "+91 98765 43216",
      joinDate: "2023-06-01",
      attendanceStatus: "absent",
    },
    {
      id: "WZ-1241",
      name: "Robert Chen",
      jobTitle: "DevOps Engineer",
      department: "Engineering",
      email: "robert.c@workzen.com",
      phone: "+91 98765 43217",
      joinDate: "2023-07-10",
      attendanceStatus: "on-leave",
    },
    {
      id: "WZ-1242",
      name: "Maria Garcia",
      jobTitle: "UX Designer",
      department: "Design",
      email: "maria.g@workzen.com",
      phone: "+91 98765 43218",
      joinDate: "2023-08-15",
      attendanceStatus: "present",
      checkInTime: "08:30 AM",
    },
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusIndicator = (status) => {
    if (status === "present") {
      return (
        <div className="status-indicator status-present" title="Present">
          <div className="status-dot"></div>
        </div>
      );
    } else if (status === "on-leave") {
      return (
        <div className="status-indicator status-leave" title="On Leave">
          <Plane className="status-icon" />
        </div>
      );
    } else {
      return (
        <div className="status-indicator status-absent" title="Absent">
          <div className="status-dot"></div>
        </div>
      );
    }
  };

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
  };

  if (selectedEmployee) {
    return (
      <div className="employee-directory-container">
        <div className="directory-header">
          <button
            className="back-btn"
            onClick={() => setSelectedEmployee(null)}
          >
            ← Back to Directory
          </button>
          <div>
            <h1 className="directory-title">{selectedEmployee.name}</h1>
            <p className="directory-subtitle">Employee Profile (View Only)</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {getInitials(selectedEmployee.name)}
              </div>
              <h2 className="profile-name">{selectedEmployee.name}</h2>
              <p className="profile-job-title">{selectedEmployee.jobTitle}</p>
              <div className="profile-status">
                {getStatusIndicator(selectedEmployee.attendanceStatus)}
                <span className="status-text">
                  {selectedEmployee.attendanceStatus === "present"
                    ? "Present"
                    : selectedEmployee.attendanceStatus === "on-leave"
                    ? "On Leave"
                    : "Absent"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card profile-main">
            <h3 className="section-title">Employee Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <p className="info-label">Employee ID</p>
                <p className="info-value">{selectedEmployee.id}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Department</p>
                <p className="info-value">{selectedEmployee.department}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Email</p>
                <p className="info-value">{selectedEmployee.email}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Phone</p>
                <p className="info-value">{selectedEmployee.phone}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Join Date</p>
                <p className="info-value">
                  {new Date(selectedEmployee.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div className="info-item">
                <p className="info-label">Status</p>
                <p className="info-value status-active">Active</p>
              </div>
              {selectedEmployee.checkInTime && (
                <div className="info-item">
                  <p className="info-label">Check In Time</p>
                  <p className="info-value">{selectedEmployee.checkInTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-directory-container">
      <div className="directory-header">
        <div>
          <h1 className="directory-title">Employee Directory</h1>
          <p className="directory-subtitle">
            View employee profiles and contact information
          </p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search employees by name, email, department, or job title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="employee-card"
            onClick={() => handleCardClick(employee)}
          >
            <div className="card-status">
              {getStatusIndicator(employee.attendanceStatus)}
            </div>

            <div className="card-content">
              <div className="employee-avatar">
                {getInitials(employee.name)}
              </div>

              <div className="employee-info">
                <h3 className="employee-name">{employee.name}</h3>
                <p className="employee-job-title">{employee.jobTitle}</p>
                <p className="employee-department">{employee.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <p>No employees found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;
