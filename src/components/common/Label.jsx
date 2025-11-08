import "./Label.css";

function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`}>
      {children}
    </label>
  );
}

export default Label;
