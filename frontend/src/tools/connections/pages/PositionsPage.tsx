import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConnections } from "../context/ConnectionsContext";
import { Position, PositionFormData } from "../types";
import PositionCard from "../components/PositionCard";
import PositionModal from "../components/PositionModal";

const PositionsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getConnectionById,
    getCompanyById,
  } = useConnections();

  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<
    Position | undefined
  >();

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleCreatePosition = async (data: PositionFormData) => {
    const positionData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate:
        data.endDate && !data.isCurrent ? new Date(data.endDate) : undefined,
    };
    await createPosition(positionData);
  };

  const handleUpdatePosition = async (data: PositionFormData) => {
    if (editingPosition?._id) {
      const positionData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate:
          data.endDate && !data.isCurrent ? new Date(data.endDate) : undefined,
      };
      await updatePosition(editingPosition._id, positionData);
      setEditingPosition(undefined);
    }
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setShowModal(true);
  };

  const handleDeletePosition = async (id: string) => {
    await deletePosition(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPosition(undefined);
  };

  if (state.loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-briefcase me-2"></i>
              Positions Management
            </h1>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate("/tools/connections")}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Position
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {state.positions.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-briefcase display-1 text-muted"></i>
              <h3 className="text-muted mt-3">No positions found</h3>
              <p className="text-muted">
                Start by adding positions to track professional relationships
              </p>
            </div>
          </div>
        ) : (
          state.positions.map((position) => {
            const connection = getConnectionById(position.connectionId);
            const company = getCompanyById(position.companyId);

            return (
              <div key={position._id} className="col-md-6 col-lg-4 mb-3">
                <PositionCard
                  position={position}
                  connectionName={connection?.name}
                  companyName={company?.name}
                  onEdit={handleEditPosition}
                  onDelete={handleDeletePosition}
                />
              </div>
            );
          })
        )}
      </div>

      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
      )}

      <PositionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={editingPosition ? handleUpdatePosition : handleCreatePosition}
        position={editingPosition}
        connections={state.connections}
        companies={state.companies}
      />
    </div>
  );
};

export default PositionsPage;
