import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

interface HealthStatus {
  success: boolean;
  status: string;
  message: string;
  data?: any;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
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
        // eslint-disable-next-line no-console
        console.error("Failed to fetch health status:", error);
      }
      return false;
    };

    const retryHealthCheck = async () => {
      const success = await fetchHealthStatus();
      if (success) return;
      const elapsed = Date.now() - startTime;
      if (elapsed >= maxWaitTime) {
        setLoading(false);
        setConnectionFailed(true);
        setHealthStatus({
          success: false,
          status: "ERROR",
          message: "Failed to connect to server after 1 minute",
        });
      } else {
        setTimeout(retryHealthCheck, retryInterval);
      }
    };

    retryHealthCheck();
  }, []);

  const Banner = () => {
    if (loading) {
      return (
        <div
          className="banner banner--loading"
          role="status"
          aria-live="polite"
        >
          <div className="spinner" aria-hidden="true" />
          <span>Connecting to server...</span>
        </div>
      );
    }
    if (connectionFailed) {
      return (
        <div className="banner banner--error" role="alert">
          <div className="status-dot" aria-hidden="true" />
          <span>Server connection failed after 1 minute</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="home">
      <Banner />
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="gradient-text">Vault</h1>
          <p className="tagline">
            A growing collection of personal productivity & tracking utilities.
          </p>
          <div className="hero-actions">
            <button
              className="btn primary"
              onClick={() => navigate("/tools/connections")}
            >
              Open ConnectVault
            </button>
            <button
              className="btn outline"
              onClick={() => navigate("/tools/savorscore")}
            >
              Explore TasteVault
            </button>
          </div>
        </div>
      </div>

      <div className="home-container">
        <section className="tools-grid" aria-labelledby="available-tools-title">
          <div className="section-header">
            <h2 id="available-tools-title">Available Apps</h2>
            <p className="section-subtitle">Choose an app to get started</p>
          </div>
          <div className="tools-container">
            <article
              className="tool-card"
              tabIndex={0}
              role="button"
              aria-label="Open ConnectVault"
              onClick={() => navigate("/tools/connections")}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate("/tools/connections")
              }
            >
              <div className="tool-icon-wrapper">
                <i
                  className="bi bi-people tool-icon text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3>ConnectVault</h3>
              <p>
                Manage professional & personal connections, companies &
                positions with ease.
              </p>
              <div className="tool-metadata">
                <span className="badge category networking">Networking</span>
              </div>
            </article>

            <article
              className="tool-card"
              tabIndex={0}
              role="button"
              aria-label="Open TasteVault"
              onClick={() => navigate("/tools/savorscore")}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate("/tools/savorscore")
              }
            >
              <div className="tool-icon-wrapper">
                <i
                  className="bi bi-star-fill tool-icon text-warning"
                  aria-hidden="true"
                />
              </div>
              <h3>TasteVault</h3>
              <p>
                Track & rate dining experiences across restaurants and dishes
                with detailed scoring.
              </p>
              <div className="tool-metadata">
                <span className="badge category dining">Food & Dining</span>
              </div>
            </article>
            {/* Future tool cards can be added here */}
          </div>
        </section>
      </div>

      <style>{`
        /* inline fallback animations remain */
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Home;
