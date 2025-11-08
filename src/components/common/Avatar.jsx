import "./Avatar.css";

function Avatar({ children, className = "" }) {
  return <div className={`avatar ${className}`}>{children}</div>;
}

function AvatarImage({ src, alt = "", className = "" }) {
  return <img src={src} alt={alt} className={`avatar-image ${className}`} />;
}

function AvatarFallback({ children, className = "" }) {
  return <div className={`avatar-fallback ${className}`}>{children}</div>;
}

export { Avatar, AvatarImage, AvatarFallback };
