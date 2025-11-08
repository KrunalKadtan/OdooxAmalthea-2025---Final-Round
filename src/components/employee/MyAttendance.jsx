import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
} from "../common";
import { Camera } from "lucide-react";
import PhotoAttendance from "../attendance/PhotoAttendance";
import "./MyAttendance.css";

function MyAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPhotoAttendance, setShowPhotoAttendance] = useState(false);

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

  if (showPhotoAttendance) {
    return (
      <div className="my-attendance">
        <button
          onClick={() => setShowPhotoAttendance(false)}
          className="btn-back-attendance"
        >
          ← Back to Attendance Log
        </button>
        <PhotoAttendance />
      </div>
    );
  }

  return (
    <div className="my-attendance">
      <div className="attendance-header">
        <div>
          <h1 className="attendance-title">My Attendance Log</h1>
          <p className="attendance-description">
            Track your attendance and working hours
          </p>
        </div>
        <button
          onClick={() => setShowPhotoAttendance(true)}
          className="btn-mark-attendance-header"
        >
          <Camera className="btn-icon" />
          Mark Attendance
        </button>
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
        <Card className="calendar-card">
          <div className="card-header-inline">
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view details</CardDescription>
          </div>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Attendance History Card */}
        <Card className="history-card">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Detailed log of your attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MyAttendance;
