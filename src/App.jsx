import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmployeesPage from "./components/EmployeesPage";
import BlankPage from "./components/BlankPage";
import UserProfile from "./components/UserProfile";
import { api } from "./services/api";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentView, setCurrentView] = useState("employees");
  const [userName, setUserName] = useState("Admin User");
  const [userRole, setUserRole] = useState("Administrator");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = api.isAuthenticated();
      const user = api.getCurrentUser();
      
      if (isAuth && user) {
        setCurrentUser(user);
        setUserName(user.full_name || user.username);
        setUserRole(user.role || 'Employee');
        setCurrentPage("admin");
        
        // Restore last view
        const savedView = localStorage.getItem('currentView');
        if (savedView) {
          setCurrentView(savedView);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setCurrentUser(data.user);
      setUserName(data.user.full_name || data.user.username);
      setUserRole(data.user.role || 'Employee');
      setCurrentPage("admin");
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (data) => {
    try {
      // Transform frontend data to backend format
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      const registrationData = {
        username: data.email.split('@')[0], // Use email prefix as username
        email: data.email,
        password: data.password,
        password2: data.confirmPassword,
        first_name: firstName,
        last_name: lastName,
        phone_number: data.phone,
        role: 'employee', // Default role
        designation: '', // Optional
        department: data.companyName || '', // Use company name as department
        basic_salary: 0,
      };
      
      await api.register(registrationData);
      alert("Registration successful! Please login with your email prefix as username.");
      setCurrentPage("login");
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Better error message handling
      let errorMessage = "Registration failed. ";
      if (typeof error.message === 'string') {
        errorMessage += error.message;
      } else if (error.message && typeof error.message === 'object') {
        errorMessage += JSON.stringify(error.message);
      } else {
        errorMessage += "Please check your input and try again.";
      }
      
      alert(errorMessage);
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  };

  const handleLogout = () => {
    api.logout();
    localStorage.removeItem('currentView');
    setCurrentPage("login");
    setCurrentUser(null);
    setUserName("Admin User");
    setUserRole("Administrator");
    setCurrentView("employees");
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
        return (
          <BlankPage
            title="Attendance"
            subtitle="Attendance page coming soon"
          />
        );
      case "time-off":
        return (
          <BlankPage title="Time Off" subtitle="Time Off page coming soon" />
        );
      case "payroll":
        return (
          <BlankPage title="Payroll" subtitle="Payroll page coming soon" />
        );
      case "reports":
        return (
          <BlankPage title="Reports" subtitle="Reports page coming soon" />
        );
      case "settings":
        return (
          <BlankPage title="Settings" subtitle="Settings page coming soon" />
        );
      default:
        return <EmployeesPage />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading WorkZen...</div>
        </div>
      </div>
    );
  }

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
          onLogout={handleLogout}
        />
        <main className="content-area">{renderView()}</main>
      </div>
    </div>
  );
}

export default App;
