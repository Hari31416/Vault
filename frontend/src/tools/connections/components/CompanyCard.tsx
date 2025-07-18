import React from "react";
import { Company } from "../types";

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
        <div className="mb-2">
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
