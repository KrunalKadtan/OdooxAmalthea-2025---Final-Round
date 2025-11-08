import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2, Clock, FileText, Sunrise, Loader2, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface EmployeeDashboardProps {
  userName: string;
}

export function EmployeeDashboard({ userName }: EmployeeDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      setMarkingAttendance(true);
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; // HH:MM:SS format
      
      await api.markAttendance({ check_in: timeString });
      toast.success('Attendance marked successfully!');
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err: any) {
      console.error('Error marking attendance:', err);
      toast.error(err.message || 'Failed to mark attendance');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline" className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const leaveBalance = dashboardData?.leaves?.balance || {};
  const totalLeaves = (leaveBalance.vacation?.total || 0) + (leaveBalance.sick?.total || 0) + (leaveBalance.casual?.total || 0);
  const usedLeaves = (leaveBalance.vacation?.used || 0) + (leaveBalance.sick?.used || 0) + (leaveBalance.casual?.used || 0);
  const remainingLeaves = totalLeaves - usedLeaves;

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
        <Button 
          size="lg" 
          variant="secondary"
          onClick={handleMarkAttendance}
          disabled={markingAttendance}
        >
          {markingAttendance ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Marking...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Mark My Attendance
            </>
          )}
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
                <span>{totalLeaves} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Used</span>
                <span>{usedLeaves} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-primary">{remainingLeaves} days</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Requests</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {dashboardData?.leaves?.pending || 0} pending
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved Leaves</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {dashboardData?.leaves?.approved || 0} approved
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
            {dashboardData?.payslips && dashboardData.payslips.length > 0 ? (
              dashboardData.payslips.map((payslip: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div>
                    <p>{formatDate(payslip.date || payslip.created_at)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payslip.date || payslip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary">{formatCurrency(payslip.net_salary || payslip.amount || 0)}</p>
                    <Button variant="link" className="h-auto p-0 text-sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No payslips available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
