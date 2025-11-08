import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserProfile } from './components/profile/UserProfile';
import { EmployeeDashboard } from './components/dashboards/EmployeeDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { HRDashboard } from './components/dashboards/HRDashboard';
import { PayrollDashboard } from './components/dashboards/PayrollDashboard';
import { AttendanceLog } from './components/employee/AttendanceLog';
import { ApplyLeave } from './components/employee/ApplyLeave';
import { ManageLeaveRequests } from './components/payroll/ManageLeaveRequests';
import { EmployeeDirectory } from './components/hr/EmployeeDirectory';
import { GeneratePayroll } from './components/payroll/GeneratePayroll';
import { Payslip } from './components/payroll/Payslip';
import { Card, CardContent } from './components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { api, User } from './services/api';

type UserRole = 'employee' | 'admin' | 'hr' | 'payroll';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [currentView, setCurrentView] = useState('employee-dashboard');
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = api.isAuthenticated();
      const user = api.getCurrentUser();
      
      if (isAuth && user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setUserName(user.full_name || user.username);
        
        // Map Django roles to your app's role types
        const roleMap: { [key: string]: UserRole } = {
          'Admin': 'admin',
          'HR': 'hr',
          'Payroll': 'payroll',
          'Employee': 'employee',
        };
        
        const mappedRole = roleMap[user.role] || 'employee';
        setUserRole(mappedRole);
        
        // Set initial view based on role
        const viewMap: { [key: string]: string } = {
          'admin': 'admin-dashboard',
          'hr': 'hr-dashboard',
          'payroll': 'payroll-dashboard',
          'employee': 'employee-dashboard',
        };
        
        setCurrentView(viewMap[mappedRole] || 'employee-dashboard');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle login with Django backend
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await api.login({ username, password });
      
      setCurrentUser(response.user);
      setUserName(response.user.full_name || response.user.username);
      
      // Map Django roles to app roles
      const roleMap: { [key: string]: UserRole } = {
        'Admin': 'admin',
        'HR': 'hr',
        'Payroll': 'payroll',
        'Employee': 'employee',
      };
      
      const mappedRole = roleMap[response.user.role] || 'employee';
      setUserRole(mappedRole);
      
      // Set view based on role
      const viewMap: { [key: string]: string } = {
        'admin': 'admin-dashboard',
        'hr': 'hr-dashboard',
        'payroll': 'payroll-dashboard',
        'employee': 'employee-dashboard',
      };
      
      setCurrentView(viewMap[mappedRole] || 'employee-dashboard');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in LoginPage component
      throw error;
    }
  };

  const handleRegister = async (data: any) => {
  // Registration is already handled by RegisterPage
  // This will be called after successful registration
  const user = api.getCurrentUser();
  
  if (user) {
    setCurrentUser(user);
    setUserName(user.full_name || user.username);
    
    const roleMap: { [key: string]: UserRole } = {
      'Admin': 'admin',
      'HR': 'hr',
      'Payroll': 'payroll',
      'Employee': 'employee',
    };
    
    const mappedRole = roleMap[user.role] || 'employee';
    setUserRole(mappedRole);
    setCurrentView('employee-dashboard');
    setIsAuthenticated(true);
  }
};
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserName('');
    setUserRole('employee');
    setCurrentView('employee-dashboard');
  };

  // Render current view based on selection
  const renderView = () => {
    switch (currentView) {
      case 'employee-dashboard':
        return <EmployeeDashboard userName={userName} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'hr-dashboard':
        return <HRDashboard onNavigate={handleNavigate} />;
      case 'payroll-dashboard':
        return <PayrollDashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <UserProfile userName={userName} userRole={userRole} currentUser={currentUser} />;
      case 'attendance-log':
        return <AttendanceLog />;
      case 'apply-leave':
        return <ApplyLeave />;
      case 'manage-leave-requests':
        return <ManageLeaveRequests />;
      case 'employee-directory':
        return <EmployeeDirectory />;
      case 'generate-payroll':
        return <GeneratePayroll />;
      case 'payslip':
        return <Payslip />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">System Settings</h1>
            <p className="text-muted-foreground mb-6">Configure WorkZen HRMS preferences</p>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <SettingsIcon className="h-12 w-12" />
                  <div>
                    <p>System settings panel coming soon...</p>
                    <p className="text-sm">Configure organizational policies, leave types, payroll settings, and more.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <EmployeeDashboard userName={userName} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading WorkZen...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Main app layout with sidebar and header
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={userName} 
          userRole={userRole}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto bg-background">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
