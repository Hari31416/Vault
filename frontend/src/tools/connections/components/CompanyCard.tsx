import React from "react";
import { Company } from "../types";
import { useConnections } from "../context/ConnectionsContext";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { getPositionsByCompanyId, getConnectionById } = useConnections();

  // Get positions for this company
  const positions = getPositionsByCompanyId(company._id!);
  const currentPositions = positions.filter((pos) => pos.isCurrent);
  const pastPositions = positions.filter((pos) => !pos.isCurrent);

  // Get unique connections for this company
  const uniqueConnectionIds = new Set(positions.map((pos) => pos.connectionId));
  const connections = Array.from(uniqueConnectionIds)
    .map((id) => getConnectionById(id))
    .filter(
      (connection): connection is NonNullable<typeof connection> =>
        connection !== undefined
    );

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      onDelete(company._id!);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center mb-3">
          <i className="bi bi-buildings me-2 text-primary"></i>
          {company.name}
        </h5>

        {/* Company Info */}
        <div className="mb-3">
          {company.industry && (
            <div className="mb-2">
              <small className="text-muted">Industry</small>
              <br />
              <span className="badge bg-primary">{company.industry}</span>
            </div>
          )}
          {company.website && (
            <div className="mb-1">
              <small className="text-muted">Website</small>
              <br />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <i className="bi bi-globe me-1"></i>
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Connections & Positions Summary */}
        <div className="mb-3">
          <div className="row text-center">
            <div className="col-4">
              <div className="text-primary">
                <i className="bi bi-people"></i>
              </div>
              <small className="text-muted">Connections</small>
              <div className="fw-bold">{connections.length}</div>
            </div>
            <div className="col-4">
              <div className="text-success">
                <i className="bi bi-briefcase-fill"></i>
              </div>
              <small className="text-muted">Current</small>
              <div className="fw-bold">{currentPositions.length}</div>
            </div>
            <div className="col-4">
              <div className="text-secondary">
                <i className="bi bi-briefcase"></i>
              </div>
              <small className="text-muted">Past</small>
              <div className="fw-bold">{pastPositions.length}</div>
            </div>
          </div>
        </div>

        {/* Sample connections */}
        {connections.length > 0 && (
          <div className="mb-2">
            <small className="text-muted">Recent Connections:</small>
            <div className="mt-1">
              {connections.slice(0, 3).map((connection) => (
                <div
                  key={connection._id}
                  className="d-flex align-items-center mb-1"
                >
                  <i
                    className="bi bi-person-circle me-2 text-muted"
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                  <span className="text-truncate small">{connection.name}</span>
                </div>
              ))}
              {connections.length > 3 && (
                <small className="text-muted">
                  +{connections.length - 3} more...
                </small>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewDetails(company._id!)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(company)}
          >
            <i className="bi bi-pencil me-1"></i>
            Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleDelete}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
