import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  days: number;
  type: string;
  reason: string;
  appliedOn: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ManageLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeId: 'WZ-1234',
      employeeName: 'John Martinez',
      department: 'Engineering',
      startDate: '2025-11-15',
      endDate: '2025-11-17',
      days: 3,
      type: 'Sick Leave',
      reason: 'Medical appointment and recovery',
      appliedOn: '2025-11-08',
      status: 'pending',
    },
    {
      id: 2,
      employeeId: 'WZ-5678',
      employeeName: 'Emma Wilson',
      department: 'Marketing',
      startDate: '2025-11-20',
      endDate: '2025-11-22',
      days: 3,
      type: 'Vacation',
      reason: 'Family vacation trip',
      appliedOn: '2025-11-05',
      status: 'pending',
    },
    {
      id: 3,
      employeeId: 'WZ-9012',
      employeeName: 'Michael Brown',
      department: 'Sales',
      startDate: '2025-11-25',
      endDate: '2025-11-25',
      days: 1,
      type: 'Personal',
      reason: 'Personal matter to attend to',
      appliedOn: '2025-11-07',
      status: 'pending',
    },
    {
      id: 4,
      employeeId: 'WZ-3456',
      employeeName: 'Sarah Chen',
      department: 'Finance',
      startDate: '2025-11-28',
      endDate: '2025-11-30',
      days: 3,
      type: 'Vacation',
      reason: 'Thanksgiving holiday',
      appliedOn: '2025-11-02',
      status: 'pending',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const handleApprove = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    alert('Leave request approved successfully!');
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
    alert('Leave request rejected.');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Manage Time-Off Requests</h1>
        <p className="text-muted-foreground">Review and approve employee leave applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <h2 className="mt-2 text-yellow-600">{pendingRequests.length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Approved This Month</p>
            <h2 className="mt-2 text-green-600">{processedRequests.filter(r => r.status === 'approved').length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Rejected This Month</p>
            <h2 className="mt-2 text-red-600">{processedRequests.filter(r => r.status === 'rejected').length}</h2>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Applications awaiting your decision</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending leave requests at the moment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p>{request.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{request.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>
                      {request.startDate} to {request.endDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                            <DialogDescription>Review the full leave application</DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Employee</p>
                                <p>{selectedRequest.employeeName} ({selectedRequest.employeeId})</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Department</p>
                                <p>{selectedRequest.department}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Leave Period</p>
                                <p>{selectedRequest.startDate} to {selectedRequest.endDate} ({selectedRequest.days} days)</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Leave Type</p>
                                <p>{selectedRequest.type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Reason</p>
                                <p>{selectedRequest.reason}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Applied On</p>
                                <p>{selectedRequest.appliedOn}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Requests</CardTitle>
            <CardDescription>Recently approved or rejected applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>{request.startDate} to {request.endDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
