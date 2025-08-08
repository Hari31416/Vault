import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout, hasAnyUsers } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Vault
        </Link>

        <div className="navbar-menu">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="navbar-button theme-toggle-button"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <>
                {user.role === "admin" && (
                  <>
                    <Link to="/admin" className="navbar-link">
                      Admin Panel
                    </Link>
                    <Link to="/register" className="navbar-link">
                      Register New User
                    </Link>
                  </>
                )}
                <span className="navbar-user">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="navbar-button logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {hasAnyUsers !== false && (
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                )}
                {hasAnyUsers === false && (
                  <Link
                    to="/register"
                    className="navbar-button register-button"
                  >
                    Register (First User)
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
