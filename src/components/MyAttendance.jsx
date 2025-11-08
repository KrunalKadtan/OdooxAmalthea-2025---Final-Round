import { useState } from "react";
import "./MyAttendance.css";

function MyAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const attendanceRecords = [
    {
      date: "2025-11-08",
      status: "Present",
      checkIn: "09:15 AM",
      checkOut: "05:45 PM",
      hours: "8h 30m",
    },
    {
      date: "2025-11-07",
      status: "Present",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      hours: "9h 00m",
    },
    {
      date: "2025-11-06",
      status: "Present",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      hours: "8h 45m",
    },
    {
      date: "2025-11-05",
      status: "Present",
      checkIn: "09:10 AM",
      checkOut: "05:50 PM",
      hours: "8h 40m",
    },
    {
      date: "2025-11-04",
      status: "Leave",
      checkIn: "-",
      checkOut: "-",
      hours: "-",
    },
    {
      date: "2025-11-01",
      status: "Present",
      checkIn: "09:05 AM",
      checkOut: "06:10 PM",
      hours: "9h 05m",
    },
    {
      date: "2025-10-31",
      status: "Present",
      checkIn: "08:50 AM",
      checkOut: "05:40 PM",
      hours: "8h 50m",
    },
    {
      date: "2025-10-30",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
      hours: "-",
    },
  ];

  const stats = {
    totalDays: 20,
    present: 16,
    absent: 1,
    leave: 3,
  };

  const getStatusBadge = (status) => {
    const CheckCircle = () => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );

    const XCircle = () => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );

    const Clock = () => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );

    switch (status) {
      case "Present":
        return (
          <span className="badge badge-present">
            <CheckCircle />
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="badge badge-absent">
            <XCircle />
            Absent
          </span>
        );
      case "Leave":
        return (
          <span className="badge badge-leave">
            <Clock />
            Leave
          </span>
        );
      default:
        return null;
    }
  };

  // Calendar generation with previous/next month dates
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek;

    const calendar = [];
    let dayCounter = 1;
    let nextMonthDay = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDayOfWeek) {
          // Previous month days
          week.push({
            day: prevMonthLastDay - prevMonthDays + j + 1,
            isCurrentMonth: false,
            isPrevMonth: true
          });
        } else if (dayCounter > daysInMonth) {
          // Next month days
          week.push({
            day: nextMonthDay++,
            isCurrentMonth: false,
            isNextMonth: true
          });
        } else {
          // Current month days
          week.push({
            day: dayCounter++,
            isCurrentMonth: true
          });
        }
      }
      calendar.push(week);
      if (i >= 4 && dayCounter > daysInMonth) break;
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="my-attendance">
      <div className="attendance-header">
        <h1 className="attendance-title">My Attendance Log</h1>
        <p className="attendance-description">
          Track your attendance and working hours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Days</p>
          <h2 className="stat-value">{stats.totalDays}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Present</p>
          <h2 className="stat-value stat-present">{stats.present}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Absent</p>
          <h2 className="stat-value stat-absent">{stats.absent}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">On Leave</p>
          <h2 className="stat-value stat-leave">{stats.leave}</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Calendar Card */}
        <div className="calendar-card">
          <div className="card-header-inline">
            <h3 className="card-title">Calendar View</h3>
            <p className="card-subtitle">Select a date to view details</p>
          </div>
          <div className="card-content">
            <div className="calendar-wrapper">
              <div className="calendar-nav-section">
                <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                  ←
                </button>
                <span className="calendar-month">
                  {monthNames[selectedDate.getMonth()]}{" "}
                  {selectedDate.getFullYear()}
                </span>
                <button className="calendar-nav-btn" onClick={handleNextMonth}>
                  →
                </button>
              </div>
              <div className="calendar-container">
                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(
                      (day) => (
                        <div key={day} className="weekday">
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="calendar-days">
                    {calendar.map((week, weekIndex) => (
                      <div key={weekIndex} className="calendar-week">
                        {week.map((dayObj, dayIndex) => {
                          const isToday = 
                            dayObj.isCurrentMonth &&
                            dayObj.day === new Date().getDate() &&
                            selectedDate.getMonth() === new Date().getMonth() &&
                            selectedDate.getFullYear() === new Date().getFullYear();
                          
                          const isSelected = 
                            dayObj.isCurrentMonth &&
                            dayObj.day === selectedDate.getDate();

                          return (
                            <div
                              key={dayIndex}
                              className={`calendar-day ${
                                !dayObj.isCurrentMonth ? "empty" : ""
                              } ${isSelected ? "selected" : ""} ${
                                isToday ? "today" : ""
                              }`}
                              onClick={() => {
                                if (dayObj.isCurrentMonth) {
                                  setSelectedDate(
                                    new Date(
                                      selectedDate.getFullYear(),
                                      selectedDate.getMonth(),
                                      dayObj.day
                                    )
                                  );
                                }
                              }}
                            >
                              {dayObj.day}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History Card */}
        <div className="history-card">
          <div className="card-header">
            <h3 className="card-title">Attendance History</h3>
            <p className="card-subtitle">Detailed log of your attendance records</p>
          </div>
          <div className="card-content">
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td>{record.checkIn}</td>
                      <td>{record.checkOut}</td>
                      <td>{record.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
