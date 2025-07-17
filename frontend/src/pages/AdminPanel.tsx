import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";

const AdminPanel: React.FC = () => {
  const { createUserByAdmin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setHealthLoading(true);
      console.log("Fetching health data...");

      const healthResponse = await fetch("/api/health/detailed");
      console.log("Health response status:", healthResponse.status);

      if (!healthResponse.ok) {
        throw new Error(
          `Health API failed with status: ${healthResponse.status}`
        );
      }

      const data = await healthResponse.json();
      console.log("Health data:", data);
      setHealthData(data);
    } catch (error) {
      console.error("Failed to fetch health data:", error);
      setHealthData(null);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const result = await createUserByAdmin(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    );

    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");

    if (result.success) {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      // Refresh health data after successful user creation
      fetchHealthData();
    }

    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage users, monitor system health, and configure settings.</p>
        </header>

        <div className="admin-grid">
          <section className="health-summary-section">
            <h2>System Health Summary</h2>
            {healthLoading ? (
              <div
                className="loading-state"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2rem",
                  backgroundColor: "var(--card-background)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  fontSize: "1.1rem",
                  color: "var(--text-color)",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>⏳</span>
                Loading health data...
              </div>
            ) : healthData && healthData.success ? (
              <div
                className="health-summary-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  className="health-card"
                  style={{
                    backgroundColor: "var(--card-background)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      🖥️
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Server Status
                    </h3>
                  </div>
                  <div
                    className="health-status"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      backgroundColor:
                        healthData.data?.server?.status === "Running"
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: `1px solid ${
                        healthData.data?.server?.status === "Running"
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                      }`,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
                      {healthData.data?.server?.status === "Running"
                        ? "✅"
                        : "❌"}
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color:
                          healthData.data?.server?.status === "Running"
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    >
                      {healthData.data?.server?.status || "Unknown"}
                    </span>
                  </div>
                  <div className="health-details" style={{ lineHeight: "1.6" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Uptime:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.server?.uptime || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Environment:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.server?.environment || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Node Version:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.server?.nodeVersion || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="health-card"
                  style={{
                    backgroundColor: "var(--card-background)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      🗄️
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Database
                    </h3>
                  </div>
                  <div
                    className="health-status"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      backgroundColor:
                        healthData.data?.database?.status === "Connected"
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: `1px solid ${
                        healthData.data?.database?.status === "Connected"
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                      }`,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
                      {healthData.data?.database?.status === "Connected"
                        ? "✅"
                        : "❌"}
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color:
                          healthData.data?.database?.status === "Connected"
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    >
                      {healthData.data?.database?.status || "Unknown"}
                    </span>
                  </div>
                  <div className="health-details" style={{ lineHeight: "1.6" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Connection:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.database?.connection || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="health-card"
                  style={{
                    backgroundColor: "var(--card-background)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      💾
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Memory Usage
                    </h3>
                  </div>
                  <div className="health-details" style={{ lineHeight: "1.6" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        RSS:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.memory?.rss || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Heap Used:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.memory?.heapUsed || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Heap Total:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.memory?.heapTotal || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        External:
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {healthData.data?.memory?.external || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="error-state"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "2rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  ⚠️
                </span>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#dc2626",
                  }}
                >
                  Failed to load health data
                </p>
                <p
                  style={{
                    margin: "0 0 1.5rem 0",
                    color: "var(--text-secondary)",
                  }}
                >
                  Please check the server connection and try again.
                </p>
                <button
                  onClick={fetchHealthData}
                  className="retry-button"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  🔄 Retry
                </button>
              </div>
            )}
          </section>

          <section className="admin-quick-links-section">
            <h2>Admin Quick Links</h2>
            <div
              className="admin-quick-links"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                className="admin-quick-link-button"
                onClick={() => (window.location.href = "/register")}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span>👤</span>
                Create New User
              </button>

              <button
                className="admin-quick-link-button"
                onClick={() => fetchHealthData()}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "var(--card-background)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🔄</span>
                Refresh Health Data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
