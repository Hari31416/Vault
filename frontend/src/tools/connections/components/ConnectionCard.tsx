import React from "react";
import { Connection } from "../types";
import { useConnections } from "../context/ConnectionsContext";

interface ConnectionCardProps {
  connection: Connection;
  onEdit: (connection: Connection) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { getPositionsByConnectionId, getCompanyById } = useConnections();

  // Get current position for this connection
  const positions = getPositionsByConnectionId(connection._id!);
  const currentPosition = positions.find((pos) => pos.isCurrent);
  const currentCompany = currentPosition
    ? getCompanyById(currentPosition.companyId)
    : null;
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${connection.name}?`)) {
      onDelete(connection._id!);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center mb-2">
          <i className="bi bi-person-circle me-2 text-primary"></i>
          {connection.name}
        </h5>

        {/* Current Position & Company */}
        {currentPosition && currentCompany ? (
          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <i className="bi bi-briefcase me-2 text-success"></i>
              <span className="fw-semibold text-success">
                {currentPosition.title}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-buildings me-2 text-primary"></i>
              <span className="text-primary">{currentCompany.name}</span>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-workspace me-2 text-muted"></i>
              <span className="text-muted small">No current position</span>
            </div>
          </div>
        )}

        <div className="mb-2">
          {/* Prioritize email and LinkedIn as most important contact info */}
          {connection.email && (
            <div className="mb-1">
              <i className="bi bi-envelope me-2 text-muted"></i>
              <a
                href={`mailto:${connection.email}`}
                className="text-decoration-none small"
              >
                {connection.email}
              </a>
            </div>
          )}
          {connection.linkedinUsername && (
            <div className="mb-1">
              <i className="bi bi-linkedin me-2 text-info"></i>
              <a
                href={`https://linkedin.com/in/${connection.linkedinUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          {connection.phone && (
            <div className="mb-1">
              <i className="bi bi-telephone me-2 text-muted"></i>
              <a
                href={`tel:${connection.phone}`}
                className="text-decoration-none small"
              >
                {connection.phone}
              </a>
            </div>
          )}
          {connection.githubUsername && (
            <div className="mb-1">
              <i className="bi bi-github me-2 text-dark"></i>
              <a
                href={`https://github.com/${connection.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small"
              >
                GitHub Profile
              </a>
            </div>
          )}
        </div>
        {connection.notes && (
          <p className="card-text text-muted small">
            {connection.notes.length > 100
              ? `${connection.notes.substring(0, 100)}...`
              : connection.notes}
          </p>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewDetails(connection._id!)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(connection)}
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

export default ConnectionCard;
