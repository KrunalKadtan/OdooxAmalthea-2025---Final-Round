import { useState } from "react";
import { Trash2 } from "lucide-react";
import "./UserSettings.css";

function UserSettings() {
  const [users, setUsers] = useState([
    {
      id: "1",
      userName: "John Doe",
      loginId: "JD001",
      email: "john.doe@workzen.com",
      role: "Employee",
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      loginId: "SJ002",
      email: "sarah.johnson@workzen.com",
      role: "HR Officer",
    },
    {
      id: "3",
      userName: "Mike Wilson",
      loginId: "MW003",
      email: "mike.wilson@workzen.com",
      role: "Payroll Officer",
    },
  ]);

  const roles = ["Employee", "HR Officer", "Payroll Officer", "Administrator"];

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">User Settings</h1>
        <p className="settings-description">
          Manage user access rights and roles. Change user roles to define their permissions and access levels.
          To add new employees, please use the Employees page.
        </p>
      </div>

      <div className="settings-card">
        <div className="card-header">
          <h2 className="card-title">User Access Management</h2>
        </div>
        <div className="card-content">
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User name</th>
                  <th>Login id</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name">{user.userName}</td>
                    <td className="user-info">{user.loginId}</td>
                    <td className="user-info">{user.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="settings-card">
        <div className="card-header">
          <h2 className="card-title">Role-Based Access Rights</h2>
        </div>
        <div className="card-content">
          <div className="permissions-grid">
            <div className="permission-box">
              <h4 className="permission-title">Employee</h4>
              <ul className="permission-list">
                <li>• View own attendance</li>
                <li>• Apply for leave</li>
                <li>• View own payslip</li>
                <li>• Update personal profile</li>
              </ul>
            </div>
            <div className="permission-box">
              <h4 className="permission-title">HR Officer</h4>
              <ul className="permission-list">
                <li>• Manage employee directory</li>
                <li>• Approve/reject leave requests</li>
                <li>• View all employee records</li>
                <li>• Generate HR reports</li>
              </ul>
            </div>
            <div className="permission-box">
              <h4 className="permission-title">Payroll Officer</h4>
              <ul className="permission-list">
                <li>• Generate payroll</li>
                <li>• View salary information</li>
                <li>• Process payments</li>
                <li>• Generate payroll reports</li>
              </ul>
            </div>
            <div className="permission-box">
              <h4 className="permission-title">Administrator</h4>
              <ul className="permission-list">
                <li>• Full system access</li>
                <li>• Manage user roles</li>
                <li>• Configure system settings</li>
                <li>• Access all modules</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
