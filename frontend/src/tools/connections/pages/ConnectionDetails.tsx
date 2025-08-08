import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConnections } from "../context/ConnectionsContext";
import { Connection, Position } from "../types";

const ConnectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    getConnectionById,
    getPositionsByConnectionId,
    getCompanyById,
  } = useConnections();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    if (id) {
      const foundConnection = getConnectionById(id);
      setConnection(foundConnection || null);

      if (foundConnection) {
        const connectionPositions = getPositionsByConnectionId(id);
        setPositions(connectionPositions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, state.connections, state.positions]);

  if (!connection) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <h3>Connection not found</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/tools/connections")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate("/tools/connections")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-person me-2"></i>
                {connection.name}
              </h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {connection.email && (
                    <div className="mb-3">
                      <strong>Email:</strong>
                      <br />
                      <a
                        href={`mailto:${connection.email}`}
                        className="text-decoration-none"
                      >
                        <i className="bi bi-envelope me-1"></i>
                        {connection.email}
                      </a>
                    </div>
                  )}

                  {connection.phone && (
                    <div className="mb-3">
                      <strong>Phone:</strong>
                      <br />
                      <a
                        href={`tel:${connection.phone}`}
                        className="text-decoration-none"
                      >
                        <i className="bi bi-telephone me-1"></i>
                        {connection.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  {connection.linkedinUsername && (
                    <div className="mb-3">
                      <strong>LinkedIn:</strong>
                      <br />
                      <a
                        href={`https://linkedin.com/in/${connection.linkedinUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <i className="bi bi-linkedin me-1"></i>
                        {connection.linkedinUsername}
                      </a>
                    </div>
                  )}

                  {connection.githubUsername && (
                    <div className="mb-3">
                      <strong>GitHub:</strong>
                      <br />
                      <a
                        href={`https://github.com/${connection.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <i className="bi bi-github me-1"></i>
                        {connection.githubUsername}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {connection.notes && (
                <div className="mt-4">
                  <strong>Notes:</strong>
                  <div className="mt-2 p-3 rounded connection-notes-box">
                    {connection.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Employment History ({positions.length})
              </h5>
            </div>
            <div className="card-body">
              {positions.length === 0 ? (
                <p className="text-muted">No positions recorded</p>
              ) : (
                <div className="list-group list-group-flush">
                  {positions
                    .sort((a, b) => {
                      if (a.isCurrent && !b.isCurrent) return -1;
                      if (!a.isCurrent && b.isCurrent) return 1;
                      const aDate = a.startDate
                        ? new Date(a.startDate)
                        : new Date(0);
                      const bDate = b.startDate
                        ? new Date(b.startDate)
                        : new Date(0);
                      return bDate.getTime() - aDate.getTime();
                    })
                    .map((position) => {
                      const company = getCompanyById(position.companyId);
                      return (
                        <div
                          key={position._id}
                          className="list-group-item px-0"
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{position.title}</h6>
                              <p className="mb-1">
                                <button
                                  className="btn btn-link p-0 text-start text-decoration-none force-brand-link"
                                  onClick={() =>
                                    navigate(
                                      `/tools/connections/company/${position.companyId}`
                                    )
                                  }
                                  style={{
                                    fontSize: "inherit",
                                    fontWeight: "500",
                                  }}
                                >
                                  <i className="bi bi-buildings me-1"></i>
                                  {company?.name}
                                </button>
                              </p>
                              <small className="text-muted">
                                {position.startDate &&
                                  formatDate(position.startDate)}
                                {position.startDate &&
                                  (position.endDate || position.isCurrent) &&
                                  " - "}
                                {position.isCurrent ? (
                                  <span className="badge bg-success">
                                    Current
                                  </span>
                                ) : (
                                  position.endDate &&
                                  formatDate(position.endDate)
                                )}
                              </small>
                            </div>
                          </div>
                          {position.notes && (
                            <small className="text-muted d-block mt-2">
                              {position.notes}
                            </small>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <small className="text-muted">
                <strong>Created:</strong> {formatDate(connection.createdAt)} |
                <strong> Last Updated:</strong>{" "}
                {formatDate(connection.updatedAt)}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDetails;
