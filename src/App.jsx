import { useState } from "react";
// Auth
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
// Layout
import Sidebar from "./components/layout/Sidebar";
import EmployeeSidebar from "./components/layout/EmployeeSidebar";
import HRSidebar from "./components/layout/HRSidebar";
import Header from "./components/layout/Header";
// Dashboard
import AdminDashboard from "./components/dashboard/AdminDashboard";
import EmployeeDashboard from "./components/dashboard/EmployeeDashboard";
import HRDashboard from "./components/dashboard/HRDashboard";
// Employee
import MyAttendance from "./components/employee/MyAttendance";
import ApplyLeave from "./components/employee/ApplyLeave";
import EmployeeDirectory from "./components/employee/EmployeeDirectory";
// Admin
import EmployeesPage from "./components/admin/EmployeesPage";
import AttendanceList from "./components/admin/AttendanceList";
import TimeOffList from "./components/admin/TimeOffList";
// Payroll
import PayrollPage from "./components/payroll/PayrollPage";
// Reports
import ReportsPage from "./components/reports/ReportsPage";
// Profile
import UserProfile from "./components/profile/UserProfile";
import UserSettings from "./components/profile/UserSettings";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentView, setCurrentView] = useState("dashboard");
  const [userName, setUserName] = useState("Admin User");
  const [userRole, setUserRole] = useState("Administrator");

  const handleLogin = (email, password) => {
    console.log("Login:", { email, password });

    // Route to different portals based on email
    if (email.includes("admin")) {
      setUserName("Admin User");
      setUserRole("Administrator");
      setCurrentView("dashboard");
      setCurrentPage("admin");
    } else if (email.includes("hr")) {
      setUserName("Lisa Anderson");
      setUserRole("HR Officer");
      setCurrentView("hr-dashboard");
      setCurrentPage("hr");
    } else if (email.includes("employee")) {
      setUserName("Sarah Johnson");
      setUserRole("Employee");
      setCurrentView("employee-dashboard");
      setCurrentPage("employee");
    } else {
      // Default to employee portal for any other email
      setUserName("John Doe");
      setUserRole("Employee");
      setCurrentView("employee-dashboard");
      setCurrentPage("employee");
    }
  };

  const handleRegister = (data) => {
    console.log("Register:", data);
    setCurrentPage("login");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "employees":
        return <EmployeesPage />;
      case "employee-directory":
        return <EmployeeDirectory />;
      case "profile":
        return <UserProfile userName={userName} userRole={userRole} />;
      case "dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "employee-dashboard":
        return <EmployeeDashboard userName={userName} />;
      case "hr-dashboard":
        return <HRDashboard onNavigate={handleNavigate} />;
      case "attendance":
        return userRole === "Employee" ? (
          <MyAttendance />
        ) : (
          <AttendanceList userRole={userRole} />
        );
      case "time-off":
        return userRole === "Employee" ? (
          <ApplyLeave />
        ) : (
          <TimeOffList userRole={userRole} />
        );
      case "payroll":
        return <PayrollPage />;
      case "reports":
        return <ReportsPage userRole={userRole} />;
      case "settings":
        return <UserSettings />;
      default:
        return <EmployeesPage />;
    }
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
      />
    );
  }

  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  // Main Portal (Admin, HR, or Employee)
  return (
    <div className="app-container">
      {currentPage === "admin" ? (
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      ) : currentPage === "hr" ? (
        <HRSidebar currentView={currentView} onNavigate={handleNavigate} />
      ) : (
        <EmployeeSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      )}
      <div className="main-content">
        <Header
          userName={userName}
          userRole={userRole}
          onNavigate={handleNavigate}
        />
        <main className="content-area">{renderView()}</main>
      </div>
    </div>
  );
}

export default App;
