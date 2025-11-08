import Badge from "./Badge";

const CheckCircle = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircle = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const Clock = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

function StatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case "Present":
        return { icon: <CheckCircle />, variant: "present", label: "Present" };
      case "Absent":
        return { icon: <XCircle />, variant: "absent", label: "Absent" };
      case "Leave":
        return { icon: <Clock />, variant: "leave", label: "Leave" };
      default:
        return { icon: null, variant: "default", label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
