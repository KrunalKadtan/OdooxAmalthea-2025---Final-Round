import { useState } from "react";
import "./TimeOffList.css";

function TimeOffList({ userRole = "Administrator" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("time-off");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    employee: "Current User",
    timeOffType: "Paid Time Off",
    startDate: "",
    endDate: "",
    allocation: "1.00",
    attachment: null,
  });

  const isAdmin = userRole === "Administrator" || userRole === "HR Officer";

  // Mock time off data
  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      startDate: "2025-10-28",
      endDate: "2025-10-28",
      timeOffType: "Paid Time Off",
      status: "Pending",
      days: 1,
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      employeeId: "EMP002",
      startDate: "2025-11-05",
      endDate: "2025-11-07",
      timeOffType: "Sick Time Off",
      status: "Approved",
      days: 3,
    },
    {
      id: "3",
      employeeName: "Mike Wilson",
      employeeId: "EMP003",
      startDate: "2025-11-15",
      endDate: "2025-11-16",
      timeOffType: "Paid Time Off",
      status: "Pending",
      days: 2,
    },
  ]);

  const handleApprove = (id) => {
    setTimeOffRequests(
      timeOffRequests.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
  };

  const handleReject = (id) => {
    setTimeOffRequests(
      timeOffRequests.map((req) =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    );
  };

  const handleSubmitRequest = () => {
    if (newRequest.startDate && newRequest.endDate) {
      const start = new Date(newRequest.startDate);
      const end = new Date(newRequest.endDate);
      const days =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      const request = {
        id: Date.now().toString(),
        employeeName: newRequest.employee,
        employeeId: "EMP001",
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        timeOffType: newRequest.timeOffType,
        status: "Pending",
        days: days,
      };

      setTimeOffRequests([...timeOffRequests, request]);
      setShowNewDialog(false);
      setNewRequest({
        employee: "Current User",
        timeOffType: "Paid Time Off",
        startDate: "",
        endDate: "",
        allocation: "1.00",
        attachment: null,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewRequest({ ...newRequest, attachment: e.target.files[0] });
    }
  };

  const filteredRequests = timeOffRequests.filter((request) =>
    request.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paidTimeOffRequests = filteredRequests.filter(
    (req) => req.timeOffType === "Paid Time Off"
  );
  const sickTimeOffRequests = filteredRequests.filter(
    (req) => req.timeOffType === "Sick Time Off"
  );

  const totalPaidDays = 24;
  const usedPaidDays = paidTimeOffRequests
    .filter((req) => req.status === "Approved")
    .reduce((sum, req) => sum + req.days, 0);
  const availablePaidDays = totalPaidDays - usedPaidDays;

  const totalSickDays = 7;
  const usedSickDays = sickTimeOffRequests
    .filter((req) => req.status === "Approved")
    .reduce((sum, req) => sum + req.days, 0);
  const availableSickDays = totalSickDays - usedSickDays;

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderTimeOffTable = (requests) => (
    <div className="timeoff-table-wrapper">
      <table className="timeoff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Time Off Type</th>
            <th>Status</th>
            {isAdmin && <th style={{ textAlign: "center" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="employee-cell">
                    <p className="employee-name">{request.employeeName}</p>
                    <p className="employee-id">{request.employeeId}</p>
                  </div>
                </td>
                <td>{formatDate(request.startDate)}</td>
                <td>{formatDate(request.endDate)}</td>
                <td>{request.timeOffType}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    {request.status === "Pending" && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="no-records">
                No time off requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="timeoff-container">
      <div className="timeoff-header">
        <h1 className="timeoff-title">Time Off</h1>
        <p className="timeoff-description">
          {isAdmin
            ? "View and manage time off requests for all employees"
            : "View your time off requests and available days"}
        </p>
      </div>

      <div className="timeoff-card">
        <div className="timeoff-card-header">
          <div className="header-left">
            <h2 className="timeoff-card-title">Time Off Management</h2>
            <button
              className="btn-new"
              onClick={() => setShowNewDialog(true)}
            >
              ➕ NEW
            </button>
          </div>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="timeoff-card-content">
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === "time-off" ? "active" : ""}`}
                onClick={() => setActiveTab("time-off")}
              >
                Time Off
              </button>
              <button
                className={`tab-btn ${activeTab === "allocation" ? "active" : ""}`}
                onClick={() => setActiveTab("allocation")}
              >
                Allocation
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "time-off" && (
                <div className="timeoff-sections">
                  {/* Paid Time Off Section */}
                  <div className="timeoff-section">
                    <div className="section-header">
                      <h3 className="section-title">Paid Time Off</h3>
                      <span className="days-available">
                        {availablePaidDays} Days Available
                      </span>
                    </div>
                    {renderTimeOffTable(paidTimeOffRequests)}
                  </div>

                  {/* Sick Time Off Section */}
                  <div className="timeoff-section">
                    <div className="section-header">
                      <h3 className="section-title">Sick Time Off</h3>
                      <span className="days-available">
                        {availableSickDays} Days Available
                      </span>
                    </div>
                    {renderTimeOffTable(sickTimeOffRequests)}
                  </div>
                </div>
              )}

              {activeTab === "allocation" && (
                <div className="allocation-placeholder">
                  <p>Allocation management coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Request Dialog */}
      {showNewDialog && (
        <div className="dialog-overlay" onClick={() => setShowNewDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Time off Type Request</h3>
              <button
                className="dialog-close"
                onClick={() => setShowNewDialog(false)}
              >
                ×
              </button>
            </div>
            <p className="dialog-description">Submit a new time off request</p>

            <div className="dialog-form">
              <div className="form-field">
                <label>Employee</label>
                <input
                  type="text"
                  value={newRequest.employee}
                  readOnly
                  className="form-input readonly"
                />
              </div>

              <div className="form-field">
                <label>Time off Type</label>
                <select
                  className="form-select"
                  value={newRequest.timeOffType}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, timeOffType: e.target.value })
                  }
                >
                  <option value="Paid Time Off">Paid time off</option>
                  <option value="Sick Time Off">Sick time off</option>
                </select>
              </div>

              <div className="form-field">
                <label>Validity Period</label>
                <div className="date-range">
                  <input
                    type="date"
                    className="form-input"
                    value={newRequest.startDate}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, startDate: e.target.value })
                    }
                  />
                  <span className="date-separator">To</span>
                  <input
                    type="date"
                    className="form-input"
                    value={newRequest.endDate}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Allocation</label>
                <div className="allocation-input">
                  <input
                    type="number"
                    step="0.5"
                    className="form-input small"
                    value={newRequest.allocation}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, allocation: e.target.value })
                    }
                  />
                  <span>Days</span>
                </div>
              </div>

              <div className="form-field">
                <label>Attachment:</label>
                <div className="file-upload">
                  <label htmlFor="file-input" className="upload-btn">
                    📤 Upload
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    className="file-input-hidden"
                    onChange={handleFileChange}
                  />
                  <span className="file-name">
                    {newRequest.attachment
                      ? newRequest.attachment.name
                      : "No file chosen"}
                  </span>
                  <span className="file-hint">(For sick leave certificate)</span>
                </div>
              </div>
            </div>

            <div className="dialog-actions">
              <button
                className="btn-discard"
                onClick={() => setShowNewDialog(false)}
              >
                Discard
              </button>
              <button className="btn-submit" onClick={handleSubmitRequest}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeOffList;
