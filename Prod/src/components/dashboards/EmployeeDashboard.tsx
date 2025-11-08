import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2, Clock, FileText, Sunrise } from 'lucide-react';
import { Badge } from '../ui/badge';

interface EmployeeDashboardProps {
  userName: string;
}

export function EmployeeDashboard({ userName }: EmployeeDashboardProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const leaveStatus = {
    pending: 2,
    approved: 8,
    total: 20,
    used: 10,
  };

  const recentPayslips = [
    { month: 'October 2025', amount: '$5,250', date: '2025-10-31' },
    { month: 'September 2025', amount: '$5,250', date: '2025-09-30' },
    { month: 'August 2025', amount: '$5,250', date: '2025-08-31' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Sunrise className="h-12 w-12 text-primary" />
        <div>
          <h1>{greeting}, {userName}!</h1>
          <p className="text-muted-foreground">Welcome back to WorkZen. Here's your overview for today.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-white">
        <h2 className="mb-2">Quick Action</h2>
        <p className="mb-6 opacity-90">Mark your attendance for today</p>
        <Button size="lg" variant="secondary">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Mark My Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Leave Status</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Your time-off balance and requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Annual Leave</span>
                <span>{leaveStatus.total} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Used</span>
                <span>{leaveStatus.used} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-primary">{leaveStatus.total - leaveStatus.used} days</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Requests</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {leaveStatus.pending} pending
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved Leaves</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {leaveStatus.approved} approved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Recent Payslips</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Download your salary statements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayslips.map((payslip, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <div>
                  <p>{payslip.month}</p>
                  <p className="text-sm text-muted-foreground">{payslip.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary">{payslip.amount}</p>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
