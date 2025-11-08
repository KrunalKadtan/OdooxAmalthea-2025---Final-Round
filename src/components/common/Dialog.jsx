import { useEffect } from "react";
import "./Dialog.css";

function Dialog({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children, className = "" }) {
  return <div className={`dialog-header ${className}`}>{children}</div>;
}

function DialogTitle({ children, className = "" }) {
  return <h3 className={`dialog-title ${className}`}>{children}</h3>;
}

function DialogDescription({ children, className = "" }) {
  return <p className={`dialog-description ${className}`}>{children}</p>;
}

function DialogFooter({ children, className = "" }) {
  return <div className={`dialog-footer ${className}`}>{children}</div>;
}

function DialogClose({ onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`dialog-close ${className}`}
      onClick={onClick}
      aria-label="Close"
    >
      ×
    </button>
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };
