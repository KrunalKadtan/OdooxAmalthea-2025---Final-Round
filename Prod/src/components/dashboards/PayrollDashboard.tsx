import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DollarSign, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';

interface PayrollDashboardProps {
  onNavigate: (view: string) => void;
}

export function PayrollDashboard({ onNavigate }: PayrollDashboardProps) {
  const pendingLeaveRequests = [
    { id: 1, name: 'John Martinez', dates: 'Nov 15-17, 2025', type: 'Sick Leave', days: 3 },
    { id: 2, name: 'Emma Wilson', dates: 'Nov 20-22, 2025', type: 'Vacation', days: 3 },
    { id: 3, name: 'Michael Brown', dates: 'Nov 25, 2025', type: 'Personal', days: 1 },
    { id: 4, name: 'Sarah Chen', dates: 'Nov 28-30, 2025', type: 'Vacation', days: 3 },
  ];

  const recentPayruns = [
    { month: 'October 2025', employees: 118, totalPayout: '$619,500', status: 'Completed', date: '2025-10-31' },
    { month: 'September 2025', employees: 115, totalPayout: '$603,750', status: 'Completed', date: '2025-09-30' },
    { month: 'August 2025', employees: 112, totalPayout: '$588,000', status: 'Completed', date: '2025-08-31' },
  ];

  const stats = [
    { label: 'Pending Leave Requests', value: pendingLeaveRequests.length.toString(), icon: ClipboardList, color: 'text-yellow-600' },
    { label: 'Last Payroll Total', value: '$619,500', icon: DollarSign, color: 'text-green-600' },
    { label: 'Employees Paid', value: '118', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Payroll Officer Dashboard</h1>
        <p className="text-muted-foreground">Manage payroll and time-off requests</p>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-8 text-white">
        <h2 className="mb-2">Monthly Payroll</h2>
        <p className="mb-6 opacity-90">Ready to process November 2025 payroll</p>
        <Button size="lg" variant="secondary" onClick={() => onNavigate('generate-payroll')}>
          <DollarSign className="h-5 w-5 mr-2" />
          Generate Monthly Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Time-Off Requests</CardTitle>
              <CardDescription>Leave applications awaiting your approval</CardDescription>
            </div>
            <Button onClick={() => onNavigate('manage-leave-requests')}>
              View All Requests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLeaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.dates}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.type}</Badge>
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => onNavigate('manage-leave-requests')}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payruns</CardTitle>
          <CardDescription>Payroll processing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayruns.map((payrun, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p>{payrun.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {payrun.employees} employees • {payrun.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600">{payrun.totalPayout}</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {payrun.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('manage-leave-requests')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3>Leave Reports</h3>
                <p className="text-sm text-muted-foreground">View detailed leave analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('payslip')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3>Payslip Reports</h3>
                <p className="text-sm text-muted-foreground">Access and manage payslips</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
