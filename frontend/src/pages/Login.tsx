import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, hasAnyUsers, user } = useAuth();
  const navigate = useNavigate();

  // Show different content if no users exist instead of redirecting
  if (hasAnyUsers === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>No Users Found</h2>
          <p className="auth-subtitle">
            No user accounts have been created yet. You need to create the first
            admin account to get started.
          </p>
          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
            <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
              The first user created will automatically become an administrator
              with full system access.
            </p>
            <Link
              to="/register"
              className="auth-button"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Create First Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make the API call directly to get user data
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Call the login function to update context
        await login(email, password);

        // Redirect based on user role from the response
        if (data.data?.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? Contact an admin to create one for you.
        </p>
      </div>
    </div>
  );
};

export default Login;
