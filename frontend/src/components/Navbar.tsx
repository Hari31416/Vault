import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../logo.svg";
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
        <Link to="/" className="navbar-brand" aria-label="Vault Home">
          <img
            src={logo}
            alt="Vault logo"
            style={{ height: 34, width: 34, marginRight: 8 }}
          />{" "}
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
                      <span className="navbar-link-short">Admin</span>
                      <span className="navbar-link-full">Admin Panel</span>
                    </Link>
                    <Link to="/register" className="navbar-link">
                      <span className="navbar-link-short">Register</span>
                      <span className="navbar-link-full">
                        Register New User
                      </span>
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
