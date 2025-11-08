import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export function AttendanceLog() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    leave: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Fetch attendance records, statistics, and leaves
      const [records, statistics, leaves] = await Promise.all([
        api.getMyAttendance(month, year),
        api.getAttendanceStatistics(month, year),
        api.getMyLeaves()
      ]);

      // Filter approved leaves for current month
      const approvedLeaves = leaves.filter((leave: any) => {
        if (leave.status !== 'Approved') return false;
        
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        
        // Check if leave overlaps with current month
        return (
          (startDate.getMonth() + 1 === month && startDate.getFullYear() === year) ||
          (endDate.getMonth() + 1 === month && endDate.getFullYear() === year) ||
          (startDate <= new Date(year, month - 1, 1) && endDate >= new Date(year, month, 0))
        );
      });

      // Convert approved leaves to attendance records
      const leaveRecords: any[] = [];
      approvedLeaves.forEach((leave: any) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        
        // Generate a record for each day in the leave period
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (d.getMonth() + 1 === month && d.getFullYear() === year) {
            leaveRecords.push({
              id: `leave-${leave.id}-${d.toISOString().split('T')[0]}`,
              date: d.toISOString().split('T')[0],
              status: 'Leave',
              check_in: null,
              check_out: null,
              hours_worked: null,
              user_name: leave.user_name,
              leave_type: leave.leave_type,
            });
          }
        }
      });

      // Merge attendance records and leave records
      const allRecords = [...records, ...leaveRecords];
      
      // Sort by date (newest first)
      allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Remove duplicates (attendance record takes precedence over leave)
      const uniqueRecords = allRecords.reduce((acc: any[], record) => {
        const exists = acc.find(r => r.date === record.date);
        if (!exists) {
          acc.push(record);
        }
        return acc;
      }, []);

      setAttendanceRecords(uniqueRecords);
      
      // Recalculate statistics including leaves
      const leaveCount = leaveRecords.length;
      if (statistics) {
        setStats({
          totalDays: (statistics.total_days || 0) + leaveCount,
          present: statistics.present || 0,
          absent: statistics.absent || 0,
          leave: (statistics.leave || 0) + leaveCount,
        });
      }
    } catch (err: any) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    // Convert 24h format (HH:MM:SS) to 12h format
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'present') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Present
        </Badge>
      );
    } else if (statusLower === 'absent') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </Badge>
      );
    } else if (statusLower === 'leave') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Leave
        </Badge>
      );
    } else if (statusLower === 'half-day') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Half Day
        </Badge>
      );
    } else if (statusLower === 'work-from-home') {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          WFH
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading attendance data...</p>
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
            <button 
              onClick={fetchAttendanceData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>My Attendance Log</h1>
        <p className="text-muted-foreground">Track your attendance and working hours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Days</p>
            <h2 className="mt-2">{stats.totalDays}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Present</p>
            <h2 className="mt-2 text-green-600">{stats.present}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Absent</p>
            <h2 className="mt-2 text-red-600">{stats.absent}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">On Leave</p>
            <h2 className="mt-2 text-blue-600">{stats.leave}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view details</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Detailed log of your attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record, index) => (
                    <TableRow key={record.id || index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{formatTime(record.check_in)}</TableCell>
                      <TableCell>{formatTime(record.check_out)}</TableCell>
                      <TableCell>{record.hours_worked ? `${record.hours_worked}h` : '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
