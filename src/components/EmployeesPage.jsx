import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './EmployeesPage.css';

function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    designation: '',
    role: 'employee',
    salary: '',
    join_date: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      
      // Transform backend data to match frontend format
      const transformedData = data.map(user => ({
        id: user.id,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        jobTitle: user.designation || 'Not specified',
        department: user.department || 'Not specified',
        email: user.email,
        phone: user.phone || 'Not provided',
        joinDate: user.join_date || user.date_joined,
        attendanceStatus: 'present', // Default, can be enhanced
        checkInTime: null,
        username: user.username,
        role: user.role,
        salary: user.salary,
        status: user.status
      }));
      
      setEmployees(transformedData);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

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
          <span className="status-icon">✈️</span>
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password || 
          !formData.first_name || !formData.last_name) {
        throw new Error('Please fill in all required fields');
      }

      // Call the register API
      await api.register(formData);
      
      // Success - refresh employee list
      await fetchEmployees();
      
      // Reset form and close modal
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        department: '',
        designation: '',
        role: 'employee',
        salary: '',
        join_date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      
    } catch (err) {
      console.error('Error adding employee:', err);
      setFormError(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormError(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      department: '',
      designation: '',
      role: 'employee',
      salary: '',
      join_date: new Date().toISOString().split('T')[0]
    });
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
            <p className="page-subtitle">Employee Profile (View Only)</p>
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={fetchEmployees} className="btn-primary" style={{ marginTop: '20px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">View and manage employee profiles ({employees.length} total)</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <span className="btn-icon">➕</span>
          NEW
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleAddEmployee} className="employee-form">
              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Engineering, HR"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="payroll">Payroll</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Salary</label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="join_date">Join Date</label>
                  <input
                    type="date"
                    id="join_date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
