import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface HomeRedirectProps {
  children: React.ReactNode;
}

const HomeRedirect: React.FC<HomeRedirectProps> = ({ children }) => {
  const { hasAnyUsers, isLoading } = useAuth();
  const [healthLoading, setHealthLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serverConnected, setServerConnected] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const maxWaitTime = 60000; // 1 minute
    const retryInterval = 3000; // 3 seconds

    const checkServerHealth = async () => {
      try {
        const response = await axios.get("/health");
        if (response.data.success) {
          setServerConnected(true);
          setHealthLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Health check failed:", error);
      }
      return false;
    };

    const retryHealthCheck = async () => {
      const success = await checkServerHealth();

      if (success) {
        return; // Connected successfully, stop retrying
      }

      const elapsed = Date.now() - startTime;

      if (elapsed >= maxWaitTime) {
        // After 1 minute, stop trying and show connection failed
        setHealthLoading(false);
        setConnectionFailed(true);
      } else {
        // Continue retrying every 3 seconds
        setTimeout(retryHealthCheck, retryInterval);
      }
    };

    retryHealthCheck();
  }, []);

  if (isLoading || hasAnyUsers === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If no users exist, show setup message instead of redirecting
  if (hasAnyUsers === false) {
    return (
      <div className="home">
        {healthLoading && (
          <section
            className="connection-banner"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--background-color)",
              borderBottom: "1px solid var(--border-color)",
              padding: "1rem",
              marginBottom: "1rem",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid var(--primary-color)",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <span>Connecting to server...</span>
            </div>
          </section>
        )}

        <div className="home-container">
          <header className="home-header">
            <h1>Welcome to MyTools</h1>
            <p>Your personal collection of useful web tools and utilities</p>
          </header>

          {!healthLoading && connectionFailed && (
            <section
              className="connection-error"
              style={{
                textAlign: "center",
                padding: "1rem",
                margin: "1rem 0",
                backgroundColor: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
                borderRadius: "8px",
                color: "var(--danger-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "var(--danger-color)",
                    borderRadius: "50%",
                  }}
                ></div>
                <span>
                  Server connection failed - Unable to connect after 1 minute
                </span>
              </div>
            </section>
          )}

          <section
            className="setup-section"
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              backgroundColor: "var(--card-background)",
              borderRadius: "12px",
              margin: "2rem 0",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚀</div>
            <h2 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              First Time Setup Required
            </h2>
            <p
              style={{
                marginBottom: "2rem",
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto 2rem",
              }}
            >
              No users have been created yet. To get started with MyTools,
              you'll need to create the first admin account. This admin account
              will have full access to manage the system and create additional
              users.
            </p>
            <Link
              to="/register"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                backgroundColor: "var(--primary-color)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                transition: "background-color 0.2s",
              }}
            >
              Create First Admin Account
            </Link>
          </section>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default HomeRedirect;
