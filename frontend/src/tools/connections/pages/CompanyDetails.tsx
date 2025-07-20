import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConnections } from "../context/ConnectionsContext";
import { Company, Position } from "../types";

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getCompanyById, getPositionsByCompanyId, getConnectionById } =
    useConnections();
  const [company, setCompany] = useState<Company | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    if (id) {
      const foundCompany = getCompanyById(id);
      setCompany(foundCompany || null);

      if (foundCompany) {
        const companyPositions = getPositionsByCompanyId(id);
        setPositions(companyPositions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, state.companies, state.positions]);

  if (!company) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <h3>Company not found</h3>
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

  const uniqueConnections = Array.from(
    new Set(positions.map((p) => p.connectionId))
  )
    .map((connectionId) => getConnectionById(connectionId))
    .filter(Boolean);

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
              <h2 className="mb-0 text-primary">
                <i className="bi bi-buildings me-2"></i>
                {company.name}
              </h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-primary">
                  {company.industry && (
                    <div className="mb-3">
                      <strong>Industry</strong>
                      <br />
                      <span className="badge bg-primary">
                        {company.industry}
                      </span>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  {company.website && (
                    <div className="mb-3">
                      <strong>Website:</strong>
                      <br />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <i className="bi bi-globe me-1"></i>
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0 text-primary">
                <i className="bi bi-briefcase me-2"></i>
                All Positions ({positions.length})
              </h5>
            </div>
            <div className="card-body">
              {positions.length === 0 ? (
                <p className="text-muted">
                  No positions recorded for this company
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Person</th>
                        <th>Position</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
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
                          const connection = getConnectionById(
                            position.connectionId
                          );
                          return (
                            <tr key={position._id}>
                              <td>
                                <button
                                  className="btn btn-link p-0 text-start text-decoration-none"
                                  onClick={() =>
                                    navigate(
                                      `/tools/connections/connection/${position.connectionId}`
                                    )
                                  }
                                  style={{
                                    color: "#0d6efd",
                                    fontWeight: "500",
                                  }}
                                >
                                  <i className="bi bi-person me-1"></i>
                                  {connection?.name}
                                </button>
                              </td>
                              <td>{position.title}</td>
                              <td>
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
                              </td>
                              <td>
                                {position.isCurrent ? (
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                ) : (
                                  <span className="badge bg-info">Former</span>
                                )}
                              </td>
                              <td>
                                {position.notes ? (
                                  <span title={position.notes}>
                                    {position.notes.length > 30
                                      ? `${position.notes.substring(0, 30)}...`
                                      : position.notes}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0 text-primary">
                <i className="bi bi-people me-2"></i>
                Connections ({uniqueConnections.length})
              </h5>
            </div>
            <div className="card-body">
              {uniqueConnections.length === 0 ? (
                <p className="text-muted">No connections at this company</p>
              ) : (
                <div className="list-group list-group-flush">
                  {uniqueConnections.map((connection) => (
                    <div key={connection!._id} className="list-group-item px-0">
                      <button
                        className="btn btn-link p-0 text-start w-100 text-decoration-none"
                        onClick={() =>
                          navigate(
                            `/tools/connections/connection/${connection!._id}`
                          )
                        }
                        style={{
                          color: "inherit",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6
                              className="mb-1"
                              style={{ color: "#0d6efd", fontWeight: "500" }}
                            >
                              <i className="bi bi-person me-1"></i>
                              {connection!.name}
                            </h6>
                            {connection!.email && (
                              <small className="text-muted">
                                {connection!.email}
                              </small>
                            )}
                          </div>
                          <i className="bi bi-arrow-right"></i>
                        </div>
                      </button>
                    </div>
                  ))}
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
                <strong>Created:</strong> {formatDate(company.createdAt)} |
                <strong> Last Updated:</strong> {formatDate(company.updatedAt)}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
