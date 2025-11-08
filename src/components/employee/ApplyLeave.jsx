import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  FormField,
} from "../common";
import "./ApplyLeave.css";

function ApplyLeave() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });

  const pastApplications = [
    {
      id: 1,
      dates: "Nov 4, 2025",
      type: "Sick Leave",
      days: 1,
      status: "Approved",
      appliedOn: "Nov 1, 2025",
      reviewedBy: "John Smith (Admin)",
      rejectionReason: null,
    },
    {
      id: 2,
      dates: "Oct 15-17, 2025",
      type: "Vacation",
      days: 3,
      status: "Approved",
      appliedOn: "Oct 1, 2025",
      reviewedBy: "Lisa Anderson (HR Officer)",
      rejectionReason: null,
    },
    {
      id: 3,
      dates: "Sep 20, 2025",
      type: "Personal",
      days: 1,
      status: "Rejected",
      appliedOn: "Sep 18, 2025",
      reviewedBy: "John Smith (Admin)",
      rejectionReason: "Insufficient staff coverage during the requested period",
    },
    {
      id: 4,
      dates: "Aug 10-14, 2025",
      type: "Vacation",
      days: 5,
      status: "Approved",
      appliedOn: "Jul 25, 2025",
      reviewedBy: "Lisa Anderson (HR Officer)",
      rejectionReason: null,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Leave application submitted successfully!");
    setFormData({ startDate: "", endDate: "", leaveType: "", reason: "" });
  };

  const getStatusVariant = (status) => {
    const variants = {
      Approved: "approved",
      Pending: "pending",
      Rejected: "rejected",
    };
    return variants[status] || "default";
  };

  return (
    <div className="apply-leave-container">
      <div className="page-header">
        <h1>Apply for Time-Off</h1>
        <p className="page-description">Submit your leave request for approval</p>
      </div>

      <div className="content-grid">
        {/* Leave Balance Card */}
        <Card className="balance-card">
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your available time-off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="balance-item balance-primary">
              <p className="balance-label">Annual Leave</p>
              <h2 className="balance-value">10 days</h2>
            </div>
            <div className="balance-item balance-secondary">
              <p className="balance-label">Sick Leave</p>
              <h2 className="balance-value">7 days</h2>
            </div>
            <div className="balance-item balance-secondary">
              <p className="balance-label">Personal Leave</p>
              <h2 className="balance-value">3 days</h2>
            </div>
          </CardContent>
        </Card>

        {/* Apply for Leave Form Card */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Apply for Leave</CardTitle>
            <CardDescription>
              Fill in the details of your leave request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-row">
                <FormField
                  label="Start Date"
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
                <FormField
                  label="End Date"
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>

              <FormField
                label="Leave Type"
                id="leaveType"
                type="select"
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                placeholder="Select leave type"
                options={[
                  { value: "sick", label: "Sick Leave" },
                  { value: "vacation", label: "Vacation Leave" },
                  { value: "personal", label: "Personal Leave" },
                  { value: "emergency", label: "Emergency Leave" },
                ]}
                required
              />

              <FormField
                label="Reason"
                id="reason"
                type="textarea"
                placeholder="Please provide a reason for your leave request..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={4}
                required
              />

              <Button type="submit" className="btn-submit">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit Leave Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Past Applications Card */}
      <Card className="history-card">
        <CardHeader>
          <CardTitle>My Past Applications</CardTitle>
          <CardDescription>History of your leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dates</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewed By</TableHead>
                <TableHead>Reason (if rejected)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.dates}</TableCell>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{application.days}</TableCell>
                  <TableCell>{application.appliedOn}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="reviewer-name">
                      {application.reviewedBy}
                    </span>
                  </TableCell>
                  <TableCell>
                    {application.status === "Rejected" && application.rejectionReason ? (
                      <span className="rejection-reason">
                        {application.rejectionReason}
                      </span>
                    ) : (
                      <span className="no-reason">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplyLeave;
