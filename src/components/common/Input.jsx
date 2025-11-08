import "./Input.css";

function Input({ 
  type = "text", 
  value, 
  onChange, 
  placeholder = "",
  className = "",
  id,
  required = false,
  disabled = false
}) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className}`}
      required={required}
      disabled={disabled}
    />
  );
}

export default Input;
