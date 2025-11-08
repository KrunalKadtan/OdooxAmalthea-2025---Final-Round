import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { UserPlus, Users, Calendar, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';

interface HRDashboardProps {
  onNavigate: (view: string) => void;
}

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const newHires = [
    { name: 'Alice Cooper', position: 'UI/UX Designer', department: 'Design', startDate: 'Nov 1, 2025' },
    { name: 'Robert Chen', position: 'Data Analyst', department: 'Analytics', startDate: 'Nov 5, 2025' },
    { name: 'Maria Garcia', position: 'Marketing Manager', department: 'Marketing', startDate: 'Nov 8, 2025' },
  ];

  const attendanceRecords = [
    { id: 'WZ-001', name: 'Sarah Johnson', department: 'Engineering', status: 'Present', time: '09:15 AM' },
    { id: 'WZ-002', name: 'Michael Brown', department: 'Sales', status: 'Present', time: '08:45 AM' },
    { id: 'WZ-003', name: 'Emma Wilson', department: 'Marketing', status: 'Absent', time: '-' },
    { id: 'WZ-004', name: 'David Lee', department: 'Finance', status: 'Present', time: '09:00 AM' },
    { id: 'WZ-005', name: 'Lisa Anderson', department: 'HR', status: 'Present', time: '08:55 AM' },
  ];

  const leaveAllocation = {
    totalEmployees: 118,
    totalLeaveDays: 2360,
    usedLeaveDays: 1240,
    remainingLeaveDays: 1120,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>HR Officer Dashboard</h1>
          <p className="text-muted-foreground">Manage your workforce and employee records</p>
        </div>
        <Button onClick={() => onNavigate('employee-directory')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create New Employee Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <h2 className="mt-2">{leaveAllocation.totalEmployees}</h2>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Hires This Month</p>
                <h2 className="mt-2">{newHires.length}</h2>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leaves Allocated</p>
                <h2 className="mt-2">{leaveAllocation.totalLeaveDays}</h2>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New Hires This Month</CardTitle>
              <CardDescription>Recently onboarded employees</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {newHires.map((hire, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p>{hire.name}</p>
                    <p className="text-sm text-muted-foreground">{hire.position} • {hire.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {hire.startDate}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
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
                      variant="outline" 
                      className={record.status === 'Present' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
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

      <Card>
        <CardHeader>
          <CardTitle>Leave Allocation Summary</CardTitle>
          <CardDescription>Organization-wide leave statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Total Leave Days</p>
              <h3 className="mt-1">{leaveAllocation.totalLeaveDays}</h3>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Used</p>
              <h3 className="mt-1 text-red-600">{leaveAllocation.usedLeaveDays}</h3>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <h3 className="mt-1 text-green-600">{leaveAllocation.remainingLeaveDays}</h3>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Utilization</p>
              <h3 className="mt-1 text-primary">
                {Math.round((leaveAllocation.usedLeaveDays / leaveAllocation.totalLeaveDays) * 100)}%
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
