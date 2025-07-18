import React, { useState } from "react";
import { Position, PositionFormData, Connection, Company } from "../types";

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PositionFormData) => Promise<void>;
  position?: Position;
  connections: Connection[];
  companies: Company[];
}

const PositionModal: React.FC<PositionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  position,
  connections,
  companies,
}) => {
  const [formData, setFormData] = useState<PositionFormData>({
    connectionId: position?.connectionId || "",
    companyId: position?.companyId || "",
    title: position?.title || "",
    startDate: position?.startDate
      ? new Date(position.startDate).toISOString().split("T")[0]
      : "",
    endDate: position?.endDate
      ? new Date(position.endDate).toISOString().split("T")[0]
      : "",
    isCurrent: position?.isCurrent || false,
    notes: position?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        connectionId: "",
        companyId: "",
        title: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        notes: "",
      });
    } catch (error) {
      console.error("Failed to save position:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
              {position ? "Edit Position" : "Add New Position"}
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
                <label htmlFor="connectionId" className="form-label">
                  Connection *
                </label>
                <select
                  className="form-select"
                  id="connectionId"
                  name="connectionId"
                  value={formData.connectionId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a connection</option>
                  {connections.map((connection) => (
                    <option key={connection._id} value={connection._id}>
                      {connection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="companyId" className="form-label">
                  Company *
                </label>
                <select
                  className="form-select"
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Position Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={formData.isCurrent}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isCurrent">
                    Current Position
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional details about this position..."
                ></textarea>
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
                disabled={
                  loading ||
                  !formData.connectionId ||
                  !formData.companyId ||
                  !formData.title.trim()
                }
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Saving...
                  </>
                ) : position ? (
                  "Update Position"
                ) : (
                  "Add Position"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PositionModal;
