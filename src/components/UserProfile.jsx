import React, { useState } from "react";
import "./UserProfile.css";

function UserProfile({ userName, userRole = "Administrator" }) {
  const [activeTab, setActiveTab] = useState("resume");
  const [skills, setSkills] = useState([
    "Leadership",
    "Management",
    "Strategic Planning",
  ]);
  const [certifications, setCertifications] = useState([
    "PMP Certified",
    "MBA - Business Administration",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [showCertDialog, setShowCertDialog] = useState(false);

  // Security state
  const [passwordData, setPasswordData] = useState({
    loginId: "OIAD20220001",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const isAdmin = userRole === "Administrator";

  const profile = {
    name: userName,
    loginId: "OIAD20220001",
    email: "admin@workzen.com",
    mobile: "+91 98765 43210",
    company: "WorkZen Technologies",
    department: "Administration",
    manager: "N/A",
    location: "Mumbai, India",
  };

  const salaryInfo = {
    monthWage: 50000,
    yearlyWage: 600000,
    workingDaysPerWeek: 5,
    breakTimeHours: 1,
    components: {
      basicSalary: { amount: 25000, percentage: 50.0 },
      houseRent: { amount: 12500, percentage: 50.0 },
      standardAllowance: { amount: 4167, percentage: 16.67 },
      performanceBonus: { amount: 2082.5, percentage: 8.33 },
      leaveTravelAllowance: { amount: 2082.5, percentage: 8.33 },
      fixedAllowance: { amount: 2918, percentage: 11.67 },
    },
    providentFund: {
      employee: { amount: 3000, percentage: 12.0 },
      employer: { amount: 3000, percentage: 12.0 },
    },
    taxDeductions: {
      professionalTax: 200,
    },
  };

  const canViewSalary =
    userRole === "Administrator" || userRole === "Payroll Officer";

  const privateInfo = {
    dateOfBirth: "1990-05-15",
    residingAddress:
      "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    nationality: "Indian",
    personalEmail: "admin.personal@gmail.com",
    gender: "Male",
    maritalStatus: "Married",
    dateOfJoining: "2020-01-15",
    bankDetails: {
      accountNumber: "1234567890123456",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      panNo: "ABCDE1234F",
      uanNo: "123456789012",
      empCode: "EMP2022001",
    },
  };

  const about =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setShowSkillDialog(false);
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
      setShowCertDialog(false);
    }
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleResetPassword = () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!isAdmin && !passwordData.oldPassword) {
      setPasswordError("Old password is required");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Simulate password reset
    setPasswordSuccess(
      "Password has been reset successfully! The employee will receive the new password via email."
    );
    setPasswordData({
      ...passwordData,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                {getInitials(profile.name)}
              </div>
              <button className="profile-edit-btn">
                <span>✏️</span>
              </button>
            </div>
          </div>

          <div className="profile-info-section">
            <h2 className="profile-name">{profile.name}</h2>
            <div className="profile-field">
              <label>Login ID</label>
              <p>{profile.loginId}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-field">
              <label>Mobile</label>
              <p>{profile.mobile}</p>
            </div>
          </div>

          <div className="profile-company-section">
            <div className="profile-field">
              <label>Company</label>
              <p>{profile.company}</p>
            </div>
            <div className="profile-field">
              <label>Department</label>
              <p>{profile.department}</p>
            </div>
            <div className="profile-field">
              <label>Manager</label>
              <p>{profile.manager}</p>
            </div>
            <div className="profile-field">
              <label>Location</label>
              <p>{profile.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "resume" ? "active" : ""}`}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            className={`tab-btn ${
              activeTab === "private-info" ? "active" : ""
            }`}
            onClick={() => setActiveTab("private-info")}
          >
            Private Info
          </button>
          {canViewSalary && (
            <button
              className={`tab-btn ${
                activeTab === "salary-info" ? "active" : ""
              }`}
              onClick={() => setActiveTab("salary-info")}
            >
              Salary Info
            </button>
          )}
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "resume" && (
            <div className="resume-content">
              <div className="resume-left">
                <div className="profile-card">
                  <div className="profile-section">
                    <h3>About</h3>
                    <p className="section-text">{about}</p>
                  </div>
                  <div className="profile-section">
                    <h3>What I love about my job</h3>
                    <p className="section-text">{about}</p>
                  </div>
                  <div className="profile-section">
                    <h3>My interests and hobbies</h3>
                    <p className="section-text">{about}</p>
                  </div>
                </div>
              </div>

              <div className="resume-right">
                <div className="profile-card skills-card">
                  <div className="card-header">
                    <h3>Skills</h3>
                    <button
                      className="add-btn"
                      onClick={() => setShowSkillDialog(true)}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="skills-container">
                    {skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="profile-card cert-card">
                  <div className="card-header">
                    <h3>Certification</h3>
                    <button
                      className="add-btn"
                      onClick={() => setShowCertDialog(true)}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="cert-container">
                    {certifications.map((cert, index) => (
                      <div key={index} className="cert-item">
                        <p>{cert}</p>
                        <button
                          className="remove-btn-cert"
                          onClick={() => handleRemoveCertification(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "private-info" && (
            <div className="private-info-content">
              {/* Personal Information */}
              <div className="profile-card">
                <h3 className="private-info-title">Personal Information</h3>
                <div className="private-info-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label className="private-label">Date of Birth</label>
                      <input
                        type="date"
                        className="private-input"
                        value={privateInfo.dateOfBirth}
                        readOnly
                      />
                    </div>
                    <div className="form-field">
                      <label className="private-label">Date of Joining</label>
                      <input
                        type="date"
                        className="private-input"
                        value={privateInfo.dateOfJoining}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="private-label">Residing Address</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.residingAddress}
                      readOnly
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="private-label">Nationality</label>
                      <input
                        type="text"
                        className="private-input"
                        value={privateInfo.nationality}
                        readOnly
                      />
                    </div>
                    <div className="form-field">
                      <label className="private-label">Gender</label>
                      <input
                        type="text"
                        className="private-input"
                        value={privateInfo.gender}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="private-label">Personal Email</label>
                      <input
                        type="email"
                        className="private-input"
                        value={privateInfo.personalEmail}
                        readOnly
                      />
                    </div>
                    <div className="form-field">
                      <label className="private-label">Marital Status</label>
                      <input
                        type="text"
                        className="private-input"
                        value={privateInfo.maritalStatus}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="profile-card">
                <h3 className="private-info-title">Bank Details</h3>
                <div className="private-info-form">
                  <div className="form-field">
                    <label className="private-label">Account Number</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.accountNumber}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label className="private-label">Bank Name</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.bankName}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label className="private-label">IFSC Code</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.ifscCode}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label className="private-label">PAN No</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.panNo}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label className="private-label">UAN NO</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.uanNo}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label className="private-label">Emp Code</label>
                    <input
                      type="text"
                      className="private-input"
                      value={privateInfo.bankDetails.empCode}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "salary-info" && (
            <div className="profile-card">
              <div className="salary-content">
                {/* Basic Wage Info */}
                <div className="salary-basic-info">
                  <div className="salary-wage-section">
                    <div className="wage-item">
                      <label className="wage-label">Month Wage</label>
                      <div className="wage-value">
                        <span className="wage-amount">
                          ₹{salaryInfo.monthWage.toLocaleString()}
                        </span>
                        <span className="wage-period">/ Month</span>
                      </div>
                    </div>
                    <div className="wage-item">
                      <label className="wage-label">Yearly wage</label>
                      <div className="wage-value">
                        <span className="wage-amount">
                          ₹{salaryInfo.yearlyWage.toLocaleString()}
                        </span>
                        <span className="wage-period">/ Yearly</span>
                      </div>
                    </div>
                  </div>
                  <div className="salary-work-section">
                    <div className="work-item">
                      <label className="work-label">
                        No of working days in a week:
                      </label>
                      <input
                        type="number"
                        value={salaryInfo.workingDaysPerWeek}
                        className="work-input"
                        readOnly
                      />
                    </div>
                    <div className="work-item">
                      <label className="work-label">Break Time:</label>
                      <div className="work-input-group">
                        <input
                          type="number"
                          value={salaryInfo.breakTimeHours}
                          className="work-input"
                          readOnly
                        />
                        <span className="work-unit">/hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Components and PF */}
                <div className="salary-details-grid">
                  {/* Salary Components */}
                  <div className="salary-components">
                    <h3 className="section-title">Salary Components</h3>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">Basic Salary</label>
                        <p className="component-desc">
                          Define Basic Salary from company cost compute it based
                          on monthly Wages
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.basicSalary.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.basicSalary.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">
                          House Rent Allowance
                        </label>
                        <p className="component-desc">
                          HRA provided to employees 50% of the basic salary
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.houseRent.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.houseRent.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">
                          Standard Allowance
                        </label>
                        <p className="component-desc">
                          A standard allowance is a predetermined, fixed amount
                          provided to employee as part of their salary
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.standardAllowance.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.standardAllowance.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">
                          Performance Bonus
                        </label>
                        <p className="component-desc">
                          Variable amount paid during payroll. The value defined
                          by the company and calculated as a % of the basic
                          Salary
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.performanceBonus.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.performanceBonus.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">
                          Leave Travel Allowance
                        </label>
                        <p className="component-desc">
                          LTA is paid by the company to employees to cover their
                          travel expenses, and calculated as a % of the basic
                          Salary
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.leaveTravelAllowance.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.leaveTravelAllowance.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="component-item">
                      <div className="component-header">
                        <label className="component-label">
                          Fixed Allowance
                        </label>
                        <p className="component-desc">
                          Fixed allowance portion of wages is determined after
                          calculating all salary components
                        </p>
                      </div>
                      <div className="component-inputs">
                        <input
                          value={`₹${salaryInfo.components.fixedAllowance.amount.toLocaleString()}`}
                          className="component-input"
                          readOnly
                        />
                        <span className="component-unit">₹ / month</span>
                        <input
                          value={`${salaryInfo.components.fixedAllowance.percentage}%`}
                          className="component-percent"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* PF and Tax Deductions */}
                  <div className="salary-deductions">
                    {/* Provident Fund */}
                    <div className="deduction-section">
                      <h3 className="section-title">
                        Provident Fund (PF) Contribution
                      </h3>

                      <div className="component-item">
                        <div className="component-header">
                          <label className="component-label">Employee</label>
                          <p className="component-desc">
                            PF is calculated based on the basic salary
                          </p>
                        </div>
                        <div className="component-inputs">
                          <input
                            value={`₹${salaryInfo.providentFund.employee.amount.toLocaleString()}`}
                            className="component-input"
                            readOnly
                          />
                          <span className="component-unit">₹ / month</span>
                          <input
                            value={`${salaryInfo.providentFund.employee.percentage}%`}
                            className="component-percent"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="component-item">
                        <div className="component-header">
                          <label className="component-label">Employer</label>
                          <p className="component-desc">
                            PF is calculated based on the basic salary
                          </p>
                        </div>
                        <div className="component-inputs">
                          <input
                            value={`₹${salaryInfo.providentFund.employer.amount.toLocaleString()}`}
                            className="component-input"
                            readOnly
                          />
                          <span className="component-unit">₹ / month</span>
                          <input
                            value={`${salaryInfo.providentFund.employer.percentage}%`}
                            className="component-percent"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tax Deductions */}
                    <div className="deduction-section">
                      <h3 className="section-title">Tax Deductions</h3>

                      <div className="component-item">
                        <div className="component-header">
                          <label className="component-label">
                            Professional Tax
                          </label>
                          <p className="component-desc">
                            Professional Tax deducted from the Gross salary
                          </p>
                        </div>
                        <div className="component-inputs">
                          <input
                            value={`₹${salaryInfo.taxDeductions.professionalTax.toLocaleString()}`}
                            className="component-input"
                            readOnly
                          />
                          <span className="component-unit">₹ / month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-content">
              {/* Password Reset Form */}
              <div className="profile-card security-form-card">
                <div className="security-section">
                  <h3 className="security-title">Password Management</h3>
                  <p className="security-description">
                    {isAdmin
                      ? "As an administrator, you can reset passwords for any user. The new password will be sent via email."
                      : "Change your password to keep your account secure."}
                  </p>
                </div>

                <div className="security-form">
                  <div className="form-field">
                    <label className="form-label">Login ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={passwordData.loginId}
                      onChange={(e) =>
                        handlePasswordChange("loginId", e.target.value)
                      }
                      placeholder="Enter login ID"
                      disabled={!isAdmin}
                    />
                    <p className="form-hint">
                      {isAdmin
                        ? "Current user login ID is automatically populated"
                        : "Your login ID"}
                    </p>
                  </div>

                  {!isAdmin && (
                    <div className="form-field">
                      <label className="form-label">Old Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        placeholder="Enter old password"
                      />
                    </div>
                  )}

                  <div className="form-field">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordError && (
                    <div className="alert alert-error">{passwordError}</div>
                  )}

                  {passwordSuccess && (
                    <div className="alert alert-success">{passwordSuccess}</div>
                  )}

                  <button
                    className="btn-reset-password"
                    onClick={handleResetPassword}
                  >
                    Reset password
                  </button>
                </div>
              </div>

              {/* Password Guidelines */}
              <div className="profile-card security-info-card">
                <div className="security-section">
                  <h3 className="security-title swift-whale">
                    <span className="whale-icon">🔒</span>
                    Swift Whale
                  </h3>
                  <p className="security-description">Change Password</p>
                </div>

                <div className="security-info">
                  <div className="info-box requirements-box">
                    <h4 className="info-title">Password Requirements:</h4>
                    <ul className="info-list">
                      <li>• Minimum 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>

                  <div className="info-box important-box">
                    <h4 className="info-title">Important:</h4>
                    <p className="info-text">
                      Make sure the employee receives the password through email
                      or another digital method. The password change mechanism
                      should be different for administrators and regular users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSkillDialog && (
        <div
          className="dialog-overlay"
          onClick={() => setShowSkillDialog(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Skill</h3>
            <p className="dialog-description">
              Enter a new skill to add to your profile
            </p>
            <input
              type="text"
              placeholder="e.g., Project Management"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              autoFocus
            />
            <div className="dialog-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowSkillDialog(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddSkill}>
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {showCertDialog && (
        <div
          className="dialog-overlay"
          onClick={() => setShowCertDialog(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Certification</h3>
            <p className="dialog-description">
              Enter a new certification to add to your profile
            </p>
            <input
              type="text"
              placeholder="e.g., AWS Certified Solutions Architect"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCertification()}
              autoFocus
            />
            <div className="dialog-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowCertDialog(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCertification}>
                Add Certification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
