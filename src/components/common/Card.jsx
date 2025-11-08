import "./Card.css";

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = "" }) {
  return <p className={`card-description ${className}`}>{children}</p>;
}

function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
