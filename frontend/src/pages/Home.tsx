import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

interface HealthStatus {
  success: boolean;
  status: string;
  message: string;
  data?: any;
}

const Home: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionFailed, setConnectionFailed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const maxWaitTime = 60000; // 1 minute
    const retryInterval = 3000; // 3 seconds

    const fetchHealthStatus = async () => {
      try {
        const basicResponse = await axios.get("/health");
        setHealthStatus(basicResponse.data);
        if (basicResponse.data.success) {
          setLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Failed to fetch health status:", error);
      }
      return false;
    };

    const retryHealthCheck = async () => {
      const success = await fetchHealthStatus();

      if (success) {
        return; // Connected successfully, stop retrying
      }

      const elapsed = Date.now() - startTime;

      if (elapsed >= maxWaitTime) {
        // After 1 minute, stop trying and show connection failed
        setLoading(false);
        setConnectionFailed(true);
        setHealthStatus({
          success: false,
          status: "ERROR",
          message: "Failed to connect to server after 1 minute",
        });
      } else {
        // Continue retrying every 3 seconds
        setTimeout(retryHealthCheck, retryInterval);
      }
    };

    retryHealthCheck();
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        {loading && (
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

        <header className="home-header">
          <h1>Welcome to MyTools</h1>
          <p>Your personal collection of useful web tools and utilities</p>
        </header>

        {!loading && connectionFailed && (
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
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
