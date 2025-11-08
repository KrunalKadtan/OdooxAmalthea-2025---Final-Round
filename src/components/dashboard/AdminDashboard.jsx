import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "../common";
import {
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  Settings,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

function AdminDashboard({ onNavigate }) {
  const departmentData = [
    { name: "Engineering", employees: 45 },
    { name: "Sales", employees: 28 },
    { name: "Marketing", employees: 18 },
    { name: "HR", employees: 12 },
    { name: "Finance", employees: 15 },
  ];

  const attendanceData = [
    { name: "Present", value: 108, color: "#16a34a" },
    { name: "Absent", value: 10, color: "#dc2626" },
  ];

  const stats = [
    {
      label: "Total Employees",
      value: "118",
      icon: Users,
      color: "text-primary",
      link: "employees",
    },
    {
      label: "Present Today",
      value: "108",
      icon: UserCheck,
      color: "text-green",
      link: "attendance",
    },
    {
      label: "Absent Today",
      value: "10",
      icon: UserX,
      color: "text-red",
      link: "attendance",
    },
    {
      label: "Pending Leaves",
      value: "15",
      icon: ClipboardList,
      color: "text-yellow",
      link: "time-off",
    },
  ];

  const pendingLeaveRequests = [
    {
      name: "John Martinez",
      dates: "Nov 15-17, 2025",
      type: "Sick Leave",
      days: 3,
    },
    {
      name: "Emma Wilson",
      dates: "Nov 20-22, 2025",
      type: "Vacation",
      days: 3,
    },
    {
      name: "Michael Brown",
      dates: "Nov 25, 2025",
      type: "Personal",
      days: 1,
    },
  ];

  const quickActions = [
    {
      title: "Manage Employees",
      description: "View and edit employee profiles",
      icon: Users,
      color: "primary",
      link: "employees",
    },
    {
      title: "Attendance",
      description: "Track employee attendance",
      icon: Calendar,
      color: "green",
      link: "attendance",
    },
    {
      title: "Payroll",
      description: "Manage payroll and payslips",
      icon: DollarSign,
      color: "blue",
      link: "payroll",
    },
    {
      title: "Reports",
      description: "Generate salary reports",
      icon: FileText,
      color: "purple",
      link: "reports",
    },
    {
      title: "Time Off",
      description: "Manage leave requests",
      icon: ClipboardList,
      color: "yellow",
      link: "time-off",
    },
    {
      title: "Settings",
      description: "Configure HRMS preferences",
      icon: Settings,
      color: "gray",
      link: "settings",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Administrator Dashboard</h1>
          <p className="dashboard-subtitle">
            Complete overview of your organization
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`stat-card ${stat.color}`}
              onClick={() => onNavigate(stat.link)}
            >
              <CardContent className="stat-card-content">
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <h2 className="stat-value">{stat.value}</h2>
                </div>
                <Icon className={`stat-icon ${stat.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
            <CardDescription>
              Distribution across all departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#005A9C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Attendance Today</CardTitle>
            <CardDescription>Current day attendance status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <Card className="leave-requests-card">
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Requests awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="leave-requests-list">
            {pendingLeaveRequests.map((request, index) => (
              <div key={index} className="leave-request-item">
                <div>
                  <p className="request-name">{request.name}</p>
                  <p className="request-details">
                    {request.dates} • {request.type} • {request.days} days
                  </p>
                </div>
                <Button size="small" onClick={() => onNavigate("time-off")}>
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="quick-action-card"
                onClick={() => onNavigate(action.link)}
              >
                <div className={`quick-action-icon-wrapper ${action.color}`}>
                  <Icon className="quick-action-icon" />
                </div>
                <div className="quick-action-text">
                  <h3 className="quick-action-title">{action.title}</h3>
                  <p className="quick-action-description">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
