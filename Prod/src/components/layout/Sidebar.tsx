import { Home, Users, Calendar, DollarSign, FileText, Settings, LogOut, UserCircle, ClipboardList, Building2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'employee' | 'admin' | 'hr' | 'payroll';
}

export function Sidebar({ currentView, onNavigate, userRole }: SidebarProps) {
  const menuItems = {
    employee: [
      { id: 'employee-dashboard', label: 'Dashboard', icon: Home },
      { id: 'attendance-log', label: 'My Attendance', icon: Calendar },
      { id: 'apply-leave', label: 'Apply for Leave', icon: FileText },
      { id: 'profile', label: 'My Profile', icon: UserCircle },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: Home },
      { id: 'employee-directory', label: 'Employee Directory', icon: Users },
      { id: 'manage-leave-requests', label: 'Leave Requests', icon: ClipboardList },
      { id: 'generate-payroll', label: 'Payroll', icon: DollarSign },
      { id: 'profile', label: 'My Profile', icon: UserCircle },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ],
    hr: [
      { id: 'hr-dashboard', label: 'Dashboard', icon: Home },
      { id: 'employee-directory', label: 'Employee Directory', icon: Users },
      { id: 'attendance-log', label: 'Attendance Monitor', icon: Calendar },
      { id: 'profile', label: 'My Profile', icon: UserCircle },
    ],
    payroll: [
      { id: 'payroll-dashboard', label: 'Dashboard', icon: Home },
      { id: 'manage-leave-requests', label: 'Time-Off Requests', icon: ClipboardList },
      { id: 'generate-payroll', label: 'Generate Payroll', icon: DollarSign },
      { id: 'payslip', label: 'Payslips', icon: FileText },
      { id: 'profile', label: 'My Profile', icon: UserCircle },
    ],
  };

  const items = menuItems[userRole];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-primary">WorkZen</h1>
            <p className="text-xs text-muted-foreground">HRMS Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
