import React, { useState, useEffect } from "react";
import { Connection, ConnectionFormData, Company } from "../types";
import { useConnections } from "../context/ConnectionsContext";

interface PositionFormData {
  companyId: string;
  title: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: ConnectionFormData & {
      positions: PositionFormData[];
    }
  ) => Promise<void>;
  connection?: Connection;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  connection,
}) => {
  const { state, getPositionsByConnectionId } = useConnections();

  const [formData, setFormData] = useState<ConnectionFormData>({
    name: connection?.name || "",
    email: connection?.email || "",
    phone: connection?.phone || "",
    linkedinUsername: connection?.linkedinUsername || "",
    githubUsername: connection?.githubUsername || "",
    notes: connection?.notes || "",
  });

  const [positions, setPositions] = useState<PositionFormData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load positions when connection changes
  useEffect(() => {
    if (connection?._id) {
      const connectionPositions = getPositionsByConnectionId(connection._id);
      const formattedPositions: PositionFormData[] = connectionPositions.map(
        (pos) => ({
          companyId: pos.companyId,
          title: pos.title,
          startDate: pos.startDate
            ? new Date(pos.startDate).toISOString().split("T")[0]
            : "",
          endDate: pos.endDate
            ? new Date(pos.endDate).toISOString().split("T")[0]
            : "",
          isCurrent: pos.isCurrent,
        })
      );
      setPositions(formattedPositions);
    } else {
      // For new connections, start with one empty position
      setPositions([
        {
          companyId: "",
          title: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ]);
    }
  }, [connection, getPositionsByConnectionId]);

  // Update form data when connection changes
  useEffect(() => {
    setFormData({
      name: connection?.name || "",
      email: connection?.email || "",
      phone: connection?.phone || "",
      linkedinUsername: connection?.linkedinUsername || "",
      githubUsername: connection?.githubUsername || "",
      notes: connection?.notes || "",
    });
  }, [connection]);

  const addPosition = () => {
    setPositions([
      ...positions,
      {
        companyId: "",
        title: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      },
    ]);
  };

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const updatePosition = (
    index: number,
    field: keyof PositionFormData,
    value: string | boolean
  ) => {
    const updatedPositions = [...positions];
    updatedPositions[index] = { ...updatedPositions[index], [field]: value };
    setPositions(updatedPositions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ ...formData, positions });
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedinUsername: "",
        githubUsername: "",
        notes: "",
      });
      setPositions([
        {
          companyId: "",
          title: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ]);
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

              {/* Positions Section */}
              <>
                <hr className="my-4" />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-muted mb-0">
                    <i className="bi bi-briefcase me-2"></i>
                    Work History
                  </h6>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={addPosition}
                  >
                    <i className="bi bi-plus me-1"></i>
                    Add Position
                  </button>
                </div>

                {positions.length === 0 && (
                  <div className="text-center py-3">
                    <i className="bi bi-briefcase text-muted"></i>
                    <p className="text-muted small mb-0">No positions found</p>
                  </div>
                )}

                {positions.map((position, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="mb-0">Position {index + 1}</h6>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removePosition(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Company</label>
                      <select
                        className="form-select"
                        value={position.companyId}
                        onChange={(e) =>
                          updatePosition(index, "companyId", e.target.value)
                        }
                      >
                        <option value="">Select a company</option>
                        {state.companies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Position Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={position.title}
                        onChange={(e) =>
                          updatePosition(index, "title", e.target.value)
                        }
                        placeholder="e.g., Software Engineer, Product Manager"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={position.startDate}
                            onChange={(e) =>
                              updatePosition(index, "startDate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={position.endDate}
                            onChange={(e) =>
                              updatePosition(index, "endDate", e.target.value)
                            }
                            disabled={position.isCurrent}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={position.isCurrent}
                          onChange={(e) =>
                            updatePosition(index, "isCurrent", e.target.checked)
                          }
                        />
                        <label className="form-check-label">
                          Current Position
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {connection && positions.length > 0 && (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    To edit positions, use the "Manage Positions" page.
                  </div>
                )}
              </>

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
