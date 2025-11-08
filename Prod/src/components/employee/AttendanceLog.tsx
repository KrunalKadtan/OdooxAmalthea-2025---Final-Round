import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AttendanceLog() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const attendanceRecords = [
    { date: '2025-11-08', status: 'Present', checkIn: '09:15 AM', checkOut: '05:45 PM', hours: '8h 30m' },
    { date: '2025-11-07', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { date: '2025-11-06', status: 'Present', checkIn: '08:45 AM', checkOut: '05:30 PM', hours: '8h 45m' },
    { date: '2025-11-05', status: 'Present', checkIn: '09:10 AM', checkOut: '05:50 PM', hours: '8h 40m' },
    { date: '2025-11-04', status: 'Leave', checkIn: '-', checkOut: '-', hours: '-' },
    { date: '2025-11-01', status: 'Present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { date: '2025-10-31', status: 'Present', checkIn: '08:50 AM', checkOut: '05:40 PM', hours: '8h 50m' },
    { date: '2025-10-30', status: 'Absent', checkIn: '-', checkOut: '-', hours: '-' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case 'Absent':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      case 'Leave':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Leave
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = {
    totalDays: 20,
    present: 16,
    absent: 1,
    leave: 3,
  };

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
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
