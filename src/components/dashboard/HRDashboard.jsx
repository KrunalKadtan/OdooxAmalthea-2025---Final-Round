import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "../common";
import { UserPlus, Users, Calendar, Briefcase } from "lucide-react";
import "./HRDashboard.css";

function HRDashboard({ onNavigate }) {
  const newHires = [
    {
      name: "Alice Cooper",
      position: "UI/UX Designer",
      department: "Design",
      startDate: "Nov 1, 2025",
    },
    {
      name: "Robert Chen",
      position: "Data Analyst",
      department: "Analytics",
      startDate: "Nov 5, 2025",
    },
    {
      name: "Maria Garcia",
      position: "Marketing Manager",
      department: "Marketing",
      startDate: "Nov 8, 2025",
    },
  ];

  const attendanceRecords = [
    {
      id: "WZ-001",
      name: "Sarah Johnson",
      department: "Engineering",
      status: "Present",
      time: "09:15 AM",
    },
    {
      id: "WZ-002",
      name: "Michael Brown",
      department: "Sales",
      status: "Present",
      time: "08:45 AM",
    },
    {
      id: "WZ-003",
      name: "Emma Wilson",
      department: "Marketing",
      status: "Absent",
      time: "-",
    },
    {
      id: "WZ-004",
      name: "David Lee",
      department: "Finance",
      status: "Present",
      time: "09:00 AM",
    },
    {
      id: "WZ-005",
      name: "Lisa Anderson",
      department: "HR",
      status: "Present",
      time: "08:55 AM",
    },
  ];

  const leaveAllocation = {
    totalEmployees: 118,
    totalLeaveDays: 2360,
    usedLeaveDays: 1240,
    remainingLeaveDays: 1120,
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">HR Officer Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your workforce and employee records
          </p>
        </div>
        <Button onClick={() => onNavigate("employees")}>
          <UserPlus className="btn-icon" />
          Create New Employee Profile
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Total Employees</p>
              <h2 className="stat-value">{leaveAllocation.totalEmployees}</h2>
            </div>
            <Users className="stat-icon text-primary" />
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">New Hires This Month</p>
              <h2 className="stat-value">{newHires.length}</h2>
            </div>
            <UserPlus className="stat-icon text-green" />
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Total Leaves Allocated</p>
              <h2 className="stat-value">{leaveAllocation.totalLeaveDays}</h2>
            </div>
            <Calendar className="stat-icon text-yellow" />
          </CardContent>
        </Card>
      </div>

      {/* New Hires Card */}
      <Card className="new-hires-card">
        <CardHeader>
          <div className="card-header-row">
            <div>
              <CardTitle>New Hires This Month</CardTitle>
              <CardDescription>Recently onboarded employees</CardDescription>
            </div>
            <Button variant="outline" size="small">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="new-hires-list">
            {newHires.map((hire, index) => (
              <div key={index} className="new-hire-item">
                <div className="new-hire-info">
                  <div className="hire-icon-wrapper">
                    <Briefcase className="hire-icon" />
                  </div>
                  <div>
                    <p className="hire-name">{hire.name}</p>
                    <p className="hire-details">
                      {hire.position} • {hire.department}
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="hire-badge">
                  {hire.startDate}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Monitoring Card */}
      <Card className="attendance-card">
        <CardHeader>
          <CardTitle>Employee Attendance Monitoring</CardTitle>
          <CardDescription>Real-time attendance tracking for today</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "Present" ? "success" : "danger"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Allocation Summary */}
      <Card className="leave-allocation-card">
        <CardHeader>
          <CardTitle>Leave Allocation Summary</CardTitle>
          <CardDescription>Organization-wide leave statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="leave-allocation-grid">
            <div className="allocation-item">
              <p className="allocation-label">Total Leave Days</p>
              <h3 className="allocation-value">
                {leaveAllocation.totalLeaveDays}
              </h3>
            </div>
            <div className="allocation-item">
              <p className="allocation-label">Used</p>
              <h3 className="allocation-value text-red">
                {leaveAllocation.usedLeaveDays}
              </h3>
            </div>
            <div className="allocation-item">
              <p className="allocation-label">Remaining</p>
              <h3 className="allocation-value text-green">
                {leaveAllocation.remainingLeaveDays}
              </h3>
            </div>
            <div className="allocation-item">
              <p className="allocation-label">Utilization</p>
              <h3 className="allocation-value text-primary">
                {Math.round(
                  (leaveAllocation.usedLeaveDays /
                    leaveAllocation.totalLeaveDays) *
                    100
                )}
                %
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HRDashboard;
