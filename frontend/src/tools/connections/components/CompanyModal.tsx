import React, { useState } from "react";
import { Company, CompanyFormData } from "../types";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  company?: Company;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  company,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || "",
    industry: company?.industry || "",
    website: company?.website || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        name: "",
        industry: "",
        website: "",
      });
    } catch (error) {
      console.error("Failed to save company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {company ? "Edit Company" : "Add New Company"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Company Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="industry" className="form-label">
                  Industry
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Saving...
                  </>
                ) : company ? (
                  "Update Company"
                ) : (
                  "Add Company"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
