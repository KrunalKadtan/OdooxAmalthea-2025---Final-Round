import { useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmployeesPage from "./components/EmployeesPage";
import BlankPage from "./components/BlankPage";
import UserProfile from "./components/UserProfile";
import UserSettings from "./components/UserSettings";
import AttendanceList from "./components/AttendanceList";
import TimeOffList from "./components/TimeOffList";
import PayrollPage from "./components/PayrollPage";
import ReportsPage from "./components/ReportsPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentView, setCurrentView] = useState("employees");
  const [userName] = useState("Admin User");
  const [userRole] = useState("Administrator");

  const handleLogin = (email, password) => {
    console.log("Login:", { email, password });
    alert("Login successful!");
    setCurrentPage("admin");
  };

  const handleRegister = (data) => {
    console.log("Register:", data);
    alert("Registration successful!");
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
        return (
          <BlankPage title="Dashboard" subtitle="Dashboard page coming soon" />
        );
      case "attendance":
        return <AttendanceList userRole={userRole} />;
      case "time-off":
        return <TimeOffList userRole={userRole} />;
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

  // Admin Portal
  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
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
