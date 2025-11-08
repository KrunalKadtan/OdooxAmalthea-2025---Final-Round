import { useState } from "react";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Input,
  Select,
  Label,
} from "../common";
import { Search, Plus, Upload } from "lucide-react";
import "./TimeOffList.css";

function TimeOffList({ userRole = "Administrator" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("time-off");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [newRequest, setNewRequest] = useState({
    employee: "Current User",
    timeOffType: "Paid Time Off",
    startDate: "",
    endDate: "",
    allocation: "1.00",
    attachment: null,
  });

  const isAdmin = userRole === "Administrator" || userRole === "HR Officer";

  // Mock time off data
  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      startDate: "2025-10-28",
      endDate: "2025-10-28",
      timeOffType: "Paid Time Off",
      status: "Pending",
      days: 1,
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      employeeId: "EMP002",
      startDate: "2025-11-05",
      endDate: "2025-11-07",
      timeOffType: "Sick Time Off",
      status: "Approved",
      days: 3,
      approvedBy: "John Smith (Admin)",
      approvedDate: "2025-10-25",
      rejectionReason: null,
    },
    {
      id: "3",
      employeeName: "Mike Wilson",
      employeeId: "EMP003",
      startDate: "2025-11-15",
      endDate: "2025-11-16",
      timeOffType: "Paid Time Off",
      status: "Pending",
      days: 2,
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
    },
    {
      id: "4",
      employeeName: "Emma Wilson",
      employeeId: "EMP004",
      startDate: "2025-10-20",
      endDate: "2025-10-22",
      timeOffType: "Paid Time Off",
      status: "Approved",
      days: 3,
      approvedBy: "Lisa Anderson (HR Officer)",
      approvedDate: "2025-10-18",
      rejectionReason: null,
    },
    {
      id: "5",
      employeeName: "David Lee",
      employeeId: "EMP005",
      startDate: "2025-11-01",
      endDate: "2025-11-01",
      timeOffType: "Sick Time Off",
      status: "Approved",
      days: 1,
      approvedBy: "John Smith (Admin)",
      approvedDate: "2025-10-30",
      rejectionReason: null,
    },
  ]);

  const handleApprove = (id) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const approverName = userRole === "HR Officer" 
      ? "Lisa Anderson (HR Officer)" 
      : "Admin User (Administrator)";
    
    setTimeOffRequests(
      timeOffRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Approved",
              approvedBy: approverName,
              approvedDate: currentDate,
            }
          : req
      )
    );
  };

  const handleRejectClick = (id) => {
    setRejectingRequestId(id);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const approverName = userRole === "HR Officer" 
      ? "Lisa Anderson (HR Officer)" 
      : "Admin User (Administrator)";
    
    setTimeOffRequests(
      timeOffRequests.map((req) =>
        req.id === rejectingRequestId
          ? {
              ...req,
              status: "Rejected",
              approvedBy: approverName,
              approvedDate: currentDate,
              rejectionReason: rejectionReason,
            }
          : req
      )
    );
    setShowRejectDialog(false);
    setRejectionReason("");
    setRejectingRequestId(null);
  };

  const handleSubmitRequest = () => {
    if (newRequest.startDate && newRequest.endDate) {
      const start = new Date(newRequest.startDate);
      const end = new Date(newRequest.endDate);
      const days =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      const request = {
        id: Date.now().toString(),
        employeeName: newRequest.employee,
        employeeId: "EMP001",
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        timeOffType: newRequest.timeOffType,
        status: "Pending",
        days: days,
      };

      setTimeOffRequests([...timeOffRequests, request]);
      setShowNewDialog(false);
      setNewRequest({
        employee: "Current User",
        timeOffType: "Paid Time Off",
        startDate: "",
        endDate: "",
        allocation: "1.00",
        attachment: null,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewRequest({ ...newRequest, attachment: e.target.files[0] });
    }
  };

  const filteredRequests = timeOffRequests.filter((request) =>
    request.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter out approved requests for Time Off tab (they show in Allocation tab)
  const pendingAndRejectedRequests = filteredRequests.filter(
    (req) => req.status !== "Approved"
  );

  const paidTimeOffRequests = pendingAndRejectedRequests.filter(
    (req) => req.timeOffType === "Paid Time Off"
  );
  const sickTimeOffRequests = pendingAndRejectedRequests.filter(
    (req) => req.timeOffType === "Sick Time Off"
  );

  const totalPaidDays = 24;
  // Calculate used days from all approved requests (not just filtered ones)
  const usedPaidDays = timeOffRequests
    .filter((req) => req.timeOffType === "Paid Time Off" && req.status === "Approved")
    .reduce((sum, req) => sum + req.days, 0);
  const availablePaidDays = totalPaidDays - usedPaidDays;

  const totalSickDays = 7;
  const usedSickDays = timeOffRequests
    .filter((req) => req.timeOffType === "Sick Time Off" && req.status === "Approved")
    .reduce((sum, req) => sum + req.days, 0);
  const availableSickDays = totalSickDays - usedSickDays;

  const getStatusVariant = (status) => {
    switch (status) {
      case "Approved":
        return "approved";
      case "Rejected":
        return "rejected";
      case "Pending":
        return "pending";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate available days for an employee
  const getAvailableDays = (employeeId, timeOffType) => {
    const totalDays = timeOffType === "Paid Time Off" ? 24 : 7;
    const usedDays = timeOffRequests
      .filter(
        (req) =>
          req.employeeId === employeeId &&
          req.timeOffType === timeOffType &&
          req.status === "Approved"
      )
      .reduce((sum, req) => sum + req.days, 0);
    return totalDays - usedDays;
  };

  const renderTimeOffTable = (requests) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Available Days</TableHead>
          <TableHead>Time Off Type</TableHead>
          <TableHead>Status</TableHead>
          {isAdmin && <TableHead style={{ textAlign: "center" }}>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="employee-cell">
                  <p className="employee-name">{request.employeeName}</p>
                  <p className="employee-id">{request.employeeId}</p>
                </div>
              </TableCell>
              <TableCell>{formatDate(request.startDate)}</TableCell>
              <TableCell>{formatDate(request.endDate)}</TableCell>
              <TableCell>
                <span className="days-count">{request.days}</span>
              </TableCell>
              <TableCell>
                <span className="available-days">
                  {getAvailableDays(request.employeeId, request.timeOffType)} days
                </span>
              </TableCell>
              <TableCell>{request.timeOffType}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  {request.status === "Pending" && (
                    <div className="action-buttons">
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleRejectClick(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={isAdmin ? 6 : 5} className="no-records">
              No time off requests found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="timeoff-container">
      <div className="timeoff-header">
        <h1 className="timeoff-title">Time Off</h1>
        <p className="timeoff-description">
          {isAdmin
            ? "View and manage time off requests for all employees"
            : "View your time off requests and available days"}
        </p>
      </div>

      <Card className="timeoff-card">
        <div className="timeoff-card-header">
          <div className="header-left">
            <h2 className="timeoff-card-title">Time Off Management</h2>
            {userRole !== "HR Officer" && (
              <Button
                variant="primary"
                size="small"
                onClick={() => setShowNewDialog(true)}
              >
                <Plus className="btn-icon" /> NEW
              </Button>
            )}
          </div>
          <div className="search-wrapper">
            <Search className="search-icon" />
            <Input
              type="text"
              className="search-input"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="timeoff-card-content">
          <Tabs defaultValue="time-off" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="time-off">Time Off</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
            </TabsList>

            <TabsContent value="time-off">
              <div className="timeoff-sections">
                {/* Paid Time Off Section */}
                <div className="timeoff-section">
                  <div className="section-header">
                    <h3 className="section-title">Paid Time Off</h3>
                  </div>
                  {renderTimeOffTable(paidTimeOffRequests)}
                </div>

                {/* Sick Time Off Section */}
                <div className="timeoff-section">
                  <div className="section-header">
                    <h3 className="section-title">Sick Time Off</h3>
                  </div>
                  {renderTimeOffTable(sickTimeOffRequests)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="allocation">
              <div className="allocation-section">
                <h3 className="allocation-title">Approved Time Off Requests</h3>
                <p className="allocation-description">
                  View all approved time off requests with approval details
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Time Off Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Approved Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeOffRequests.filter((req) => req.status === "Approved")
                      .length > 0 ? (
                      timeOffRequests
                        .filter((req) => req.status === "Approved")
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="employee-cell">
                                <p className="employee-name">
                                  {request.employeeName}
                                </p>
                                <p className="employee-id">
                                  {request.employeeId}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{request.timeOffType}</TableCell>
                            <TableCell>{formatDate(request.startDate)}</TableCell>
                            <TableCell>{formatDate(request.endDate)}</TableCell>
                            <TableCell>
                              <span className="days-badge">{request.days} {request.days === 1 ? 'day' : 'days'}</span>
                            </TableCell>
                            <TableCell>
                              <span className="approver-name">
                                {request.approvedBy}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(request.approvedDate)}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="no-records">
                          No approved time off requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog isOpen={showNewDialog} onClose={() => setShowNewDialog(false)}>
        <DialogClose onClick={() => setShowNewDialog(false)} />
        <DialogHeader>
          <DialogTitle>Time off Type Request</DialogTitle>
          <DialogDescription>Submit a new time off request</DialogDescription>
        </DialogHeader>

        <div className="dialog-form">
          <div className="form-field">
            <Label>Employee</Label>
            <Input
              type="text"
              value={newRequest.employee}
              readOnly
              disabled
            />
          </div>

          <div className="form-field">
            <Label>Time off Type</Label>
            <Select
              value={newRequest.timeOffType}
              onChange={(e) =>
                setNewRequest({ ...newRequest, timeOffType: e.target.value })
              }
            >
              <option value="Paid Time Off">Paid time off</option>
              <option value="Sick Time Off">Sick time off</option>
            </Select>
          </div>

          <div className="form-field">
            <Label>Validity Period</Label>
            <div className="date-range">
              <Input
                type="date"
                value={newRequest.startDate}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, startDate: e.target.value })
                }
              />
              <span className="date-separator">To</span>
              <Input
                type="date"
                value={newRequest.endDate}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-field">
            <Label>Allocation</Label>
            <div className="allocation-input">
              <Input
                type="number"
                step="0.5"
                className="small"
                value={newRequest.allocation}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, allocation: e.target.value })
                }
              />
              <span>Days</span>
            </div>
          </div>

          <div className="form-field">
            <Label>Attachment:</Label>
            <div className="file-upload">
              <label htmlFor="file-input" className="upload-btn">
                <Upload className="upload-icon" /> Upload
              </label>
              <input
                id="file-input"
                type="file"
                className="file-input-hidden"
                onChange={handleFileChange}
              />
              <span className="file-name">
                {newRequest.attachment
                  ? newRequest.attachment.name
                  : "No file chosen"}
              </span>
              <span className="file-hint">(For sick leave certificate)</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setShowNewDialog(false)}
          >
            Discard
          </Button>
          <Button variant="primary" onClick={handleSubmitRequest}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog isOpen={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
        <DialogClose onClick={() => {
          setShowRejectDialog(false);
          setRejectionReason("");
          setRejectingRequestId(null);
        }} />
        <DialogHeader>
          <DialogTitle>Reject Time Off Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request
          </DialogDescription>
        </DialogHeader>

        <div className="dialog-form">
          <div className="form-field">
            <Label>Rejection Reason</Label>
            <textarea
              className="rejection-textarea"
              rows={4}
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
              setRejectingRequestId(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectConfirm}>
            Reject Request
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default TimeOffList;
