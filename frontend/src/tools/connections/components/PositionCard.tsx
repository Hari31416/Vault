import React from "react";
import { useNavigate } from "react-router-dom";
import { Position } from "../types";

interface PositionCardProps {
  position: Position;
  connectionName?: string;
  companyName?: string;
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  connectionName,
  companyName,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this position?`)) {
      onDelete(position._id!);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{position.title}</h5>
        {connectionName && (
          <h6 className="card-subtitle mb-2">
            <button
              className="btn btn-link p-0 text-start text-decoration-none"
              onClick={() =>
                navigate(
                  `/tools/connections/connection/${position.connectionId}`
                )
              }
              style={{
                fontSize: "inherit",
                color: "#6c757d",
                fontWeight: "400",
              }}
            >
              <i className="bi bi-person me-1"></i>
              {connectionName}
            </button>
          </h6>
        )}
        {companyName && (
          <h6 className="card-subtitle mb-2">
            <button
              className="btn btn-link p-0 text-start text-decoration-none"
              onClick={() =>
                navigate(`/tools/connections/company/${position.companyId}`)
              }
              style={{
                fontSize: "inherit",
                color: "#0d6efd",
                fontWeight: "500",
              }}
            >
              <i className="bi bi-buildings me-1"></i>
              {companyName}
            </button>
          </h6>
        )}
        <div className="mb-2 text-primary">
          <div className="mb-1">
            <i className="bi bi-calendar me-2"></i>
            {position.startDate && formatDate(position.startDate)}
            {position.startDate &&
              (position.endDate || position.isCurrent) &&
              " - "}
            {position.isCurrent ? (
              <span className="badge bg-success">Current</span>
            ) : (
              position.endDate && formatDate(position.endDate)
            )}
          </div>
        </div>
        {position.notes && (
          <p className="card-text text-muted small">
            {position.notes.length > 100
              ? `${position.notes.substring(0, 100)}...`
              : position.notes}
          </p>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(position)}
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

export default PositionCard;
