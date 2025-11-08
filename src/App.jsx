import { useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Sidebar from "./components/Sidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";
import Header from "./components/Header";
import EmployeesPage from "./components/EmployeesPage";
import UserProfile from "./components/UserProfile";
import UserSettings from "./components/UserSettings";
import AttendanceList from "./components/AttendanceList";
import MyAttendance from "./components/MyAttendance";
import TimeOffList from "./components/TimeOffList";
import ApplyLeave from "./components/ApplyLeave";
import PayrollPage from "./components/PayrollPage";
import ReportsPage from "./components/ReportsPage";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
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
      case "profile":
        return <UserProfile userName={userName} userRole={userRole} />;
      case "dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "employee-dashboard":
        return <EmployeeDashboard userName={userName} />;
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

  // Main Portal (Admin or Employee)
  return (
    <div className="app-container">
      {currentPage === "admin" ? (
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
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
