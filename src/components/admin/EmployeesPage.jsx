import React, { useState } from 'react';
import { Search, Plus, Plane, X, Edit } from 'lucide-react';
import './EmployeesPage.css';

function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
  });

  const [employees, setEmployees] = useState([
    { id: 'WZ-1234', name: 'Sarah Johnson', jobTitle: 'Senior Software Engineer', department: 'Engineering', email: 'sarah.j@workzen.com', phone: '+91 98765 43210', joinDate: '2023-01-15', attendanceStatus: 'present', checkInTime: '09:00 AM' },
    { id: 'WZ-1235', name: 'Michael Brown', jobTitle: 'Sales Manager', department: 'Sales', email: 'michael.b@workzen.com', phone: '+91 98765 43211', joinDate: '2023-02-20', attendanceStatus: 'on-leave' },
    { id: 'WZ-1236', name: 'Emma Wilson', jobTitle: 'Marketing Specialist', department: 'Marketing', email: 'emma.w@workzen.com', phone: '+91 98765 43212', joinDate: '2023-03-10', attendanceStatus: 'present', checkInTime: '08:45 AM' },
    { id: 'WZ-1237', name: 'David Lee', jobTitle: 'Financial Analyst', department: 'Finance', email: 'david.l@workzen.com', phone: '+91 98765 43213', joinDate: '2023-04-05', attendanceStatus: 'absent' },
    { id: 'WZ-1238', name: 'Lisa Anderson', jobTitle: 'HR Manager', department: 'HR', email: 'lisa.a@workzen.com', phone: '+91 98765 43214', joinDate: '2022-12-01', attendanceStatus: 'present', checkInTime: '09:15 AM' },
    { id: 'WZ-1239', name: 'John Martinez', jobTitle: 'Product Designer', department: 'Design', email: 'john.m@workzen.com', phone: '+91 98765 43215', joinDate: '2023-05-15', attendanceStatus: 'present', checkInTime: '09:30 AM' },
    { id: 'WZ-1240', name: 'Anna Taylor', jobTitle: 'Backend Developer', department: 'Engineering', email: 'anna.t@workzen.com', phone: '+91 98765 43216', joinDate: '2023-06-01', attendanceStatus: 'absent' },
    { id: 'WZ-1241', name: 'Robert Chen', jobTitle: 'DevOps Engineer', department: 'Engineering', email: 'robert.c@workzen.com', phone: '+91 98765 43217', joinDate: '2023-07-10', attendanceStatus: 'on-leave' },
    { id: 'WZ-1242', name: 'Maria Garcia', jobTitle: 'UX Designer', department: 'Design', email: 'maria.g@workzen.com', phone: '+91 98765 43218', joinDate: '2023-08-15', attendanceStatus: 'present', checkInTime: '08:30 AM' },
  ]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusIndicator = (status) => {
    if (status === 'present') {
      return (
        <div className="status-indicator status-present" title="Present">
          <div className="status-dot"></div>
        </div>
      );
    } else if (status === 'on-leave') {
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

  const handleCardClick = (employee, e) => {
    if (e.target.closest('button')) {
      return;
    }
    setSelectedEmployee(employee);
  };

  if (selectedEmployee) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => setSelectedEmployee(null)}>
            ← Back to Employees
          </button>
          <div>
            <h1 className="page-title">{selectedEmployee.name}</h1>
            <p className="page-subtitle">Employee Profile</p>
          </div>
          <button
            className="btn-edit"
            onClick={() => {
              setEditEmployee({ ...selectedEmployee });
              setShowEditDialog(true);
            }}
          >
            <Edit className="btn-icon" />
            Edit Profile
          </button>
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
                  {selectedEmployee.attendanceStatus === 'present' ? 'Present' : 
                   selectedEmployee.attendanceStatus === 'on-leave' ? 'On Leave' : 'Absent'}
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
                <p className="info-value">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
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

        {/* Edit Employee Dialog */}
        {showEditDialog && editEmployee && (
          <div className="dialog-overlay" onClick={() => setShowEditDialog(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <h2 className="dialog-title">Edit Employee</h2>
                  <p className="dialog-description">Update employee profile information</p>
                </div>
                <button
                  className="dialog-close"
                  onClick={() => setShowEditDialog(false)}
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="dialog-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editEmployee.name}
                      onChange={(e) =>
                        setEditEmployee({ ...editEmployee, name: e.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editEmployee.email}
                      onChange={(e) =>
                        setEditEmployee({ ...editEmployee, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editEmployee.phone}
                      onChange={(e) =>
                        setEditEmployee({ ...editEmployee, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <select
                      className="form-select"
                      value={editEmployee.jobTitle}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          jobTitle: e.target.value,
                        })
                      }
                    >
                      <option value="">Select job title</option>
                      <option value="Senior Software Engineer">Senior Software Engineer</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Junior Software Engineer">Junior Software Engineer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Marketing Specialist">Marketing Specialist</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="HR Executive">HR Executive</option>
                      <option value="Financial Analyst">Financial Analyst</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Product Designer">Product Designer</option>
                      <option value="UX Designer">UX Designer</option>
                      <option value="UI Designer">UI Designer</option>
                      <option value="Graphic Designer">Graphic Designer</option>
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={editEmployee.department}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          department: e.target.value,
                        })
                      }
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditEmployee(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-add"
                  onClick={() => {
                    if (
                      editEmployee.name &&
                      editEmployee.email &&
                      editEmployee.department
                    ) {
                      const updatedEmployees = employees.map((emp) =>
                        emp.id === editEmployee.id ? editEmployee : emp
                      );
                      setEmployees(updatedEmployees);
                      setSelectedEmployee(editEmployee);
                      setShowEditDialog(false);
                      setEditEmployee(null);
                    } else {
                      alert('Please fill in all required fields');
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">View and manage employee profiles</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="btn-icon" />
          NEW
        </button>
      </div>

      {/* Add Employee Dialog */}
      {showAddDialog && (
        <div className="dialog-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h2 className="dialog-title">Add New Employee</h2>
                <p className="dialog-description">Create a new employee profile</p>
              </div>
              <button
                className="dialog-close"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="dialog-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <select
                    className="form-select"
                    value={newEmployee.jobTitle}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        jobTitle: e.target.value,
                      })
                    }
                  >
                    <option value="">Select job title</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Junior Software Engineer">Junior Software Engineer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="HR Executive">HR Executive</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Product Designer">Product Designer</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="UI Designer">UI Designer</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewEmployee({
                    name: '',
                    email: '',
                    phone: '',
                    jobTitle: '',
                    department: '',
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="btn-add"
                onClick={() => {
                  if (
                    newEmployee.name &&
                    newEmployee.email &&
                    newEmployee.department
                  ) {
                    const newEmp = {
                      id: `WZ-${1243 + employees.length}`,
                      name: newEmployee.name,
                      email: newEmployee.email,
                      phone: newEmployee.phone || 'N/A',
                      jobTitle: newEmployee.jobTitle || 'Not Specified',
                      department: newEmployee.department,
                      joinDate: new Date().toISOString().split('T')[0],
                      attendanceStatus: 'absent',
                    };
                    setEmployees([...employees, newEmp]);
                    setShowAddDialog(false);
                    setNewEmployee({
                      name: '',
                      email: '',
                      phone: '',
                      jobTitle: '',
                      department: '',
                    });
                  } else {
                    alert('Please fill in all required fields');
                  }
                }}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search"
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
            onClick={(e) => handleCardClick(employee, e)}
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

export default EmployeesPage;
