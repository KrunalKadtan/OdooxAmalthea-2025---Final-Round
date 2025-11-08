import "./StatCard.css";

function StatCard({ 
  label, 
  value, 
  icon, 
  variant = "default",
  trend,
  className = "" 
}) {
  return (
    <div className={`stat-card stat-card-${variant} ${className}`}>
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <h2 className="stat-card-value">{value}</h2>
        {trend && <p className="stat-card-trend">{trend}</p>}
      </div>
      {icon && <div className="stat-card-icon">{icon}</div>}
    </div>
  );
}

export default StatCard;
