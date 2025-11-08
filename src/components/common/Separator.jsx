import "./Separator.css";

function Separator({ orientation = "horizontal", className = "" }) {
  return (
    <div
      className={`separator separator-${orientation} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

export default Separator;
