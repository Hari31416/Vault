import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, createUserByAdmin, user, hasAnyUsers } = useAuth();
  const navigate = useNavigate();

  // Check if user should have access to this page
  useEffect(() => {
    if (hasAnyUsers === true && (!user || user.role !== "admin")) {
      // If users exist and current user is not admin, redirect to login
      navigate("/login");
    }
  }, [hasAnyUsers, user, navigate]);

  const isFirstUser = hasAnyUsers === false;
  const isAdminCreatingUser = user && user.role === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    let result;
    if (isFirstUser) {
      // First user registration
      result = await register(username, email, password);
      if (result.success) {
        // First user becomes admin, redirect to admin panel
        navigate("/admin");
      }
    } else if (isAdminCreatingUser) {
      // Admin creating a new user
      result = await createUserByAdmin(username, email, password, role);
      if (result.success) {
        // Clear form on success
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("user");
        setSuccess("User created successfully!");
      }
    }

    if (!result?.success) {
      setError(result?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          {isFirstUser
            ? "Create Admin Account"
            : isAdminCreatingUser
            ? "Create New User"
            : "Create Account"}
        </h2>
        <p className="auth-subtitle">
          {isFirstUser
            ? "Welcome! Create the first admin account to get started."
            : isAdminCreatingUser
            ? "Create a new user account."
            : "Join us today! Create your account to get started."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {(error || success) && (
            <div className={error ? "error-message" : "success-message"}>
              {error || success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              minLength={3}
              maxLength={30}
            />
          </div>

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
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>

          {isAdminCreatingUser && (
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading
              ? "Creating Account..."
              : isFirstUser
              ? "Create Admin Account"
              : isAdminCreatingUser
              ? "Create User"
              : "Create Account"}
          </button>
        </form>

        {!isAdminCreatingUser && (
          <p className="auth-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
