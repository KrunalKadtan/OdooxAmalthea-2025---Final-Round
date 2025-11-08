import "./Select.css";

function Select({ 
  value, 
  onChange, 
  children,
  className = "",
  id,
  required = false,
  disabled = false
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`select ${className}`}
      required={required}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

export default Select;
