import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../logo.svg";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout, hasAnyUsers } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="navbar" ref={navbarRef}>
        <div className="navbar-container">
          <Link
            to="/"
            className="navbar-brand"
            aria-label="Vault Home"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="Vault logo"
              style={{ height: 34, width: 34, marginRight: 8 }}
            />{" "}
            Vault
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className={`hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className="navbar-menu">
            <div className="navbar-links">
              <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
                Home
              </Link>
              <button
                aria-label="Toggle dark mode"
                onClick={() => {
                  toggleTheme();
                  closeMobileMenu();
                }}
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
                      <Link
                        to="/admin"
                        className="navbar-link"
                        onClick={closeMobileMenu}
                      >
                        <span className="navbar-link-short">Admin</span>
                        <span className="navbar-link-full">Admin Panel</span>
                      </Link>
                      <Link
                        to="/register"
                        className="navbar-link"
                        onClick={closeMobileMenu}
                      >
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
                    <Link
                      to="/login"
                      className="navbar-link"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  )}
                  {hasAnyUsers === false && (
                    <Link
                      to="/register"
                      className="navbar-button register-button"
                      onClick={closeMobileMenu}
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

      {/* Mobile Menu Overlay - Outside navbar for proper positioning */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={(e) => {
            // Close menu if clicking on the backdrop
            if (e.target === e.currentTarget) {
              closeMobileMenu();
            }
          }}
        >
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <button
              aria-label="Toggle dark mode"
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              className="mobile-menu-button theme-toggle-button"
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
                    <Link
                      to="/admin"
                      className="mobile-menu-link"
                      onClick={closeMobileMenu}
                    >
                      Admin
                    </Link>
                    <Link
                      to="/register"
                      className="mobile-menu-link"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="mobile-menu-button logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {hasAnyUsers !== false && (
                  <Link
                    to="/login"
                    className="mobile-menu-link"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                )}
                {hasAnyUsers === false && (
                  <Link
                    to="/register"
                    className="mobile-menu-button register-button"
                    onClick={closeMobileMenu}
                  >
                    Register (First User)
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
