import { useState } from "react";
import "./ApplyLeave.css";

function ApplyLeave() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });

  const pastApplications = [
    {
      id: 1,
      dates: "Nov 4, 2025",
      type: "Sick Leave",
      days: 1,
      status: "Approved",
      appliedOn: "Nov 1, 2025",
    },
    {
      id: 2,
      dates: "Oct 15-17, 2025",
      type: "Vacation",
      days: 3,
      status: "Approved",
      appliedOn: "Oct 1, 2025",
    },
    {
      id: 3,
      dates: "Sep 20, 2025",
      type: "Personal",
      days: 1,
      status: "Rejected",
      appliedOn: "Sep 18, 2025",
    },
    {
      id: 4,
      dates: "Aug 10-14, 2025",
      type: "Vacation",
      days: 5,
      status: "Approved",
      appliedOn: "Jul 25, 2025",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Leave application submitted successfully!");
    setFormData({ startDate: "", endDate: "", leaveType: "", reason: "" });
  };

  const getStatusBadge = (status) => {
    const badges = {
      Approved: { className: "badge-approved" },
      Pending: { className: "badge-pending" },
      Rejected: { className: "badge-rejected" },
    };
    const badge = badges[status];
    return <span className={`status-badge ${badge.className}`}>{status}</span>;
  };

  return (
    <div className="apply-leave-container">
      <div className="page-header">
        <h1>Apply for Time-Off</h1>
        <p className="page-description">Submit your leave request for approval</p>
      </div>

      <div className="content-grid">
        {/* Leave Balance Card */}
        <div className="balance-card">
          <div className="card-header">
            <h3 className="card-title">Leave Balance</h3>
            <p className="card-description">Your available time-off</p>
          </div>
          <div className="card-content">
            <div className="balance-item balance-primary">
              <p className="balance-label">Annual Leave</p>
              <h2 className="balance-value">10 days</h2>
            </div>
            <div className="balance-item balance-secondary">
              <p className="balance-label">Sick Leave</p>
              <h2 className="balance-value">7 days</h2>
            </div>
            <div className="balance-item balance-secondary">
              <p className="balance-label">Personal Leave</p>
              <h2 className="balance-value">3 days</h2>
            </div>
          </div>
        </div>

        {/* Apply for Leave Form Card */}
        <div className="form-card">
          <div className="card-header">
            <h3 className="card-title">Apply for Leave</h3>
            <p className="card-description">
              Fill in the details of your leave request
            </p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    className="form-input"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="leaveType">Leave Type</label>
                <select
                  id="leaveType"
                  className="form-select"
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  className="form-textarea"
                  placeholder="Please provide a reason for your leave request..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>

              <button type="submit" className="btn-submit">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit Leave Application
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Past Applications Card */}
      <div className="history-card">
        <div className="card-header">
          <h3 className="card-title">My Past Applications</h3>
          <p className="card-description">History of your leave requests</p>
        </div>
        <div className="card-content">
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Dates</th>
                  <th>Type</th>
                  <th>Days</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.dates}</td>
                    <td>{application.type}</td>
                    <td>{application.days}</td>
                    <td>{application.appliedOn}</td>
                    <td>{getStatusBadge(application.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;
