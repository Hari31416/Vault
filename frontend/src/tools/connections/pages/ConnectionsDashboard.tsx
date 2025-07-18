import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConnections } from "../context/ConnectionsContext";
import {
  Connection,
  Company,
  ConnectionFormData,
  CompanyFormData,
} from "../types";
import SearchBar from "../components/SearchBar";
import ConnectionCard from "../components/ConnectionCard";
import CompanyCard from "../components/CompanyCard";
import ConnectionModal from "../components/ConnectionModal";
import CompanyModal from "../components/CompanyModal";

const ConnectionsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useConnections();

  const [searchResults, setSearchResults] = useState<{
    connections: Connection[];
    companies: Company[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"connections" | "companies">(
    "connections"
  );
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState<
    Connection | undefined
  >();
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();

  useEffect(() => {
    fetchConnections();
    fetchCompanies();
  }, []);

  const handleSearchResults = (results: {
    connections: Connection[];
    companies: Company[];
  }) => {
    setSearchResults(results);
  };

  const handleSearchClear = () => {
    setSearchResults(null);
  };

  const handleCreateConnection = async (data: ConnectionFormData) => {
    await createConnection(data);
  };

  const handleUpdateConnection = async (data: ConnectionFormData) => {
    if (editingConnection?._id) {
      await updateConnection(editingConnection._id, data);
      setEditingConnection(undefined);
    }
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setShowConnectionModal(true);
  };

  const handleDeleteConnection = async (id: string) => {
    await deleteConnection(id);
  };

  const handleViewConnectionDetails = (id: string) => {
    navigate(`/tools/connections/connection/${id}`);
  };

  const handleCreateCompany = async (data: CompanyFormData) => {
    await createCompany(data);
  };

  const handleUpdateCompany = async (data: CompanyFormData) => {
    if (editingCompany?._id) {
      await updateCompany(editingCompany._id, data);
      setEditingCompany(undefined);
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setShowCompanyModal(true);
  };

  const handleDeleteCompany = async (id: string) => {
    await deleteCompany(id);
  };

  const handleViewCompanyDetails = (id: string) => {
    navigate(`/tools/connections/company/${id}`);
  };

  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
    setEditingConnection(undefined);
  };

  const handleCloseCompanyModal = () => {
    setShowCompanyModal(false);
    setEditingCompany(undefined);
  };

  const displayConnections = searchResults
    ? searchResults.connections
    : state.connections;
  const displayCompanies = searchResults
    ? searchResults.companies
    : state.companies;

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Connections Tracker</h1>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/tools/connections/positions")}
            >
              <i className="bi bi-briefcase me-2"></i>
              Manage Positions
            </button>
          </div>
          <SearchBar
            onResults={handleSearchResults}
            onClear={handleSearchClear}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "connections" ? "active" : ""
                }`}
                onClick={() => setActiveTab("connections")}
              >
                <i className="bi bi-people me-1"></i>
                Connections ({displayConnections.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "companies" ? "active" : ""
                }`}
                onClick={() => setActiveTab("companies")}
              >
                <i className="bi bi-buildings me-1"></i>
                Companies ({displayCompanies.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === "connections" && (
        <div className="row">
          <div className="col-12 mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowConnectionModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Connection
            </button>
          </div>
          {displayConnections.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-people display-1 text-muted"></i>
                <h3 className="text-muted mt-3">No connections found</h3>
                <p className="text-muted">
                  {searchResults
                    ? "Try a different search term"
                    : "Start by adding your first connection"}
                </p>
              </div>
            </div>
          ) : (
            displayConnections.map((connection) => (
              <div key={connection._id} className="col-md-6 col-lg-4 mb-3">
                <ConnectionCard
                  connection={connection}
                  onEdit={handleEditConnection}
                  onDelete={handleDeleteConnection}
                  onViewDetails={handleViewConnectionDetails}
                />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "companies" && (
        <div className="row">
          <div className="col-12 mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowCompanyModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Company
            </button>
          </div>
          {displayCompanies.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-buildings display-1 text-muted"></i>
                <h3 className="text-muted mt-3">No companies found</h3>
                <p className="text-muted">
                  {searchResults
                    ? "Try a different search term"
                    : "Start by adding your first company"}
                </p>
              </div>
            </div>
          ) : (
            displayCompanies.map((company) => (
              <div key={company._id} className="col-md-6 col-lg-4 mb-3">
                <CompanyCard
                  company={company}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                  onViewDetails={handleViewCompanyDetails}
                />
              </div>
            ))
          )}
        </div>
      )}

      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
      )}

      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={handleCloseConnectionModal}
        onSubmit={
          editingConnection ? handleUpdateConnection : handleCreateConnection
        }
        connection={editingConnection}
      />

      <CompanyModal
        isOpen={showCompanyModal}
        onClose={handleCloseCompanyModal}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        company={editingCompany}
      />
    </div>
  );
};

export default ConnectionsDashboard;
