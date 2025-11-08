import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import "./AttendanceList.css";

function AttendanceList({ userRole = "Administrator" }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("date");

  const isAdmin =
    userRole === "Administrator" ||
    userRole === "HR Officer" ||
    userRole === "Payroll Officer";

  // Mock attendance data
  const attendanceRecords = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      date: "2024-01-22",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
      status: "Present",
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      employeeId: "EMP002",
      date: "2024-01-22",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
      status: "Present",
    },
    {
      id: "3",
      employeeName: "Mike Wilson",
      employeeId: "EMP003",
      date: "2024-01-22",
      checkIn: "10:30",
      checkOut: "18:30",
      workHours: "08:00",
      extraHours: "00:00",
      status: "Present",
    },
    {
      id: "4",
      employeeName: "Emily Brown",
      employeeId: "EMP004",
      date: "2024-01-22",
      checkIn: "09:45",
      checkOut: "18:45",
      workHours: "09:00",
      extraHours: "00:00",
      status: "Present",
    },
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "status-present";
      case "Absent":
        return "status-absent";
      case "Leave":
        return "status-leave";
      case "Half Day":
        return "status-halfday";
      default:
        return "status-default";
    }
  };

  const presentCount = filteredRecords.filter(
    (r) => r.status === "Present"
  ).length;

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance</h1>
        <p className="attendance-description">
          {isAdmin
            ? "View and manage attendance records for all employees"
            : "View your day-wise attendance for the ongoing month"}
        </p>
      </div>

      <div className="attendance-card">
        <div className="attendance-card-header">
          <h2 className="attendance-card-title">Attendances List View</h2>
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="attendance-card-content">
          {/* Date Navigation */}
          <div className="date-navigation">
            <button className="nav-btn" onClick={handlePreviousDate}>
              ←
            </button>
            <button className="nav-btn" onClick={handleNextDate}>
              →
            </button>
            <select
              className="view-mode-select"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="day">Day</option>
            </select>
            <div className="current-date">
              <Calendar className="calendar-icon" />
              <span className="date-text">{formatDate(selectedDate)}</span>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Emp</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Extra Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="employee-cell">
                          <p className="employee-name">{record.employeeName}</p>
                          <p className="employee-id">{record.employeeId}</p>
                        </div>
                      </td>
                      <td>{record.checkIn}</td>
                      <td>{record.checkOut}</td>
                      <td className="work-hours">{record.workHours}</td>
                      <td className="extra-hours">{record.extraHours}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-records">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="summary-grid">
            <div className="summary-card summary-present">
              <p className="summary-count">{presentCount}</p>
              <p className="summary-label">Present</p>
            </div>
            <div className="summary-card summary-absent">
              <p className="summary-count">0</p>
              <p className="summary-label">Absent</p>
            </div>
            <div className="summary-card summary-leave">
              <p className="summary-count">0</p>
              <p className="summary-label">On Leave</p>
            </div>
            <div className="summary-card summary-halfday">
              <p className="summary-count">0</p>
              <p className="summary-label">Half Day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceList;
