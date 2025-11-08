import "./Badge.css";

function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
