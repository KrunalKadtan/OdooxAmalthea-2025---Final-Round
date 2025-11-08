import "./Alert.css";

function Alert({ children, variant = "default", className = "" }) {
  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      {children}
    </div>
  );
}

function AlertTitle({ children, className = "" }) {
  return <h5 className={`alert-title ${className}`}>{children}</h5>;
}

function AlertDescription({ children, className = "" }) {
  return <div className={`alert-description ${className}`}>{children}</div>;
}

export { Alert, AlertTitle, AlertDescription };
