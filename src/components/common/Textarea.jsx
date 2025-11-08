import "./Textarea.css";

function Textarea({ 
  value, 
  onChange, 
  placeholder = "",
  className = "",
  id,
  rows = 4,
  required = false,
  disabled = false
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`textarea ${className}`}
      rows={rows}
      required={required}
      disabled={disabled}
    />
  );
}

export default Textarea;
