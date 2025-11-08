import "./Button.css";

function Button({ 
  children, 
  variant = "primary", 
  size = "medium",
  className = "", 
  onClick,
  type = "button",
  disabled = false 
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
