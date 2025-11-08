import "./Skeleton.css";

function Skeleton({ className = "", width, height, variant = "default" }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
    />
  );
}

export default Skeleton;
