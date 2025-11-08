import React, { useState } from 'react';
import './UserProfile.css';

function UserProfile({ userName }) {
  const [activeTab, setActiveTab] = useState('resume');
  const [skills, setSkills] = useState(['Leadership', 'Management', 'Strategic Planning']);
  const [certifications, setCertifications] = useState(['PMP Certified', 'MBA - Business Administration']);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [showCertDialog, setShowCertDialog] = useState(false);

  const profile = {
    name: userName,
    loginId: 'OIAD20220001',
    email: 'admin@workzen.com',
    mobile: '+91 98765 43210',
    company: 'WorkZen Technologies',
    department: 'Administration',
    manager: 'N/A',
    location: 'Mumbai, India'
  };

  const about = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setShowSkillDialog(false);
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
      setShowCertDialog(false);
    }
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
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
            className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button 
            className={`tab-btn ${activeTab === 'private-info' ? 'active' : ''}`}
            onClick={() => setActiveTab('private-info')}
          >
            Private Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'salary-info' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary-info')}
          >
            Salary Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === 'resume' && (
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
                    <button className="add-btn" onClick={() => setShowSkillDialog(true)}>
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
                    <button className="add-btn" onClick={() => setShowCertDialog(true)}>
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

          {activeTab === 'private-info' && (
            <div className="profile-card">
              <p className="coming-soon">Private information section coming soon...</p>
            </div>
          )}

          {activeTab === 'salary-info' && (
            <div className="profile-card">
              <p className="coming-soon">Salary information section coming soon...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-card">
              <p className="coming-soon">Security settings section coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {showSkillDialog && (
        <div className="dialog-overlay" onClick={() => setShowSkillDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Skill</h3>
            <p className="dialog-description">Enter a new skill to add to your profile</p>
            <input
              type="text"
              placeholder="e.g., Project Management"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              autoFocus
            />
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowSkillDialog(false)}>
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
        <div className="dialog-overlay" onClick={() => setShowCertDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Certification</h3>
            <p className="dialog-description">Enter a new certification to add to your profile</p>
            <input
              type="text"
              placeholder="e.g., AWS Certified Solutions Architect"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCertification()}
              autoFocus
            />
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowCertDialog(false)}>
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
