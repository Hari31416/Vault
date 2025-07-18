import React, { useState } from "react";
import { Connection, ConnectionFormData } from "../types";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  connection?: Connection;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  connection,
}) => {
  const [formData, setFormData] = useState<ConnectionFormData>({
    name: connection?.name || "",
    email: connection?.email || "",
    phone: connection?.phone || "",
    linkedinUsername: connection?.linkedinUsername || "",
    githubUsername: connection?.githubUsername || "",
    notes: connection?.notes || "",
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
        email: "",
        phone: "",
        linkedinUsername: "",
        githubUsername: "",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to save connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
              {connection ? "Edit Connection" : "Add New Connection"}
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
                  Name *
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
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="linkedinUsername" className="form-label">
                  LinkedIn Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="linkedinUsername"
                  name="linkedinUsername"
                  value={formData.linkedinUsername}
                  onChange={handleChange}
                  placeholder="linkedin-username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="githubUsername" className="form-label">
                  GitHub Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="githubUsername"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                  placeholder="github-username"
                />
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
                  placeholder="Personal notes about this connection..."
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
                ) : connection ? (
                  "Update Connection"
                ) : (
                  "Add Connection"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
