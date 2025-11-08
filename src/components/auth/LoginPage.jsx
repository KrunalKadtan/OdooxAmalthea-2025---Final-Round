import React, { useState } from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import "./LoginPage.css";

function LoginPage({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      onLogin(email, password);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <h1>WorkZen</h1>
          </div>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <div className="footer-text">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-icon"><CheckCircle2 /></div>
          <div className="toast-content">
            <p className="toast-title">Login Successful!</p>
            <p className="toast-message">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
