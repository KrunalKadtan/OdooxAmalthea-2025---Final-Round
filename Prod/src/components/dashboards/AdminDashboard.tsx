import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, UserCheck, UserX, ClipboardList, Settings } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const departmentData = [
    { name: 'Engineering', employees: 45 },
    { name: 'Sales', employees: 28 },
    { name: 'Marketing', employees: 18 },
    { name: 'HR', employees: 12 },
    { name: 'Finance', employees: 15 },
  ];

  const attendanceData = [
    { name: 'Present', value: 108, color: '#16a34a' },
    { name: 'Absent', value: 10, color: '#dc2626' },
  ];

  const stats = [
    { label: 'Total Employees', value: '118', icon: Users, color: 'text-primary' },
    { label: 'Present Today', value: '108', icon: UserCheck, color: 'text-green-600' },
    { label: 'Absent Today', value: '10', icon: UserX, color: 'text-red-600' },
    { label: 'Pending Leaves', value: '15', icon: ClipboardList, color: 'text-yellow-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Administrator Dashboard</h1>
        <p className="text-muted-foreground">Complete overview of your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h2 className="mt-2">{stat.value}</h2>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
            <CardDescription>Distribution across all departments</CardDescription>
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

        <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Requests awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'John Martinez', dates: 'Nov 15-17, 2025', type: 'Sick Leave', days: 3 },
              { name: 'Emma Wilson', dates: 'Nov 20-22, 2025', type: 'Vacation', days: 3 },
              { name: 'Michael Brown', dates: 'Nov 25, 2025', type: 'Personal', days: 1 },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p>{request.name}</p>
                  <p className="text-sm text-muted-foreground">{request.dates} • {request.type} • {request.days} days</p>
                </div>
                <Button size="sm" onClick={() => onNavigate('manage-leave-requests')}>
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('employee-directory')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3>Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and edit employee profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('settings')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3>System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure HRMS preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
