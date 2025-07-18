import React from "react";
import { Routes, Route } from "react-router-dom";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import ConnectionsDashboard from "./pages/ConnectionsDashboard";
import ConnectionDetails from "./pages/ConnectionDetails";
import CompanyDetails from "./pages/CompanyDetails";
import PositionsPage from "./pages/PositionsPage";

const ConnectionsApp: React.FC = () => {
  return (
    <ConnectionsProvider>
      <Routes>
        <Route path="/" element={<ConnectionsDashboard />} />
        <Route path="/connection/:id" element={<ConnectionDetails />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/positions" element={<PositionsPage />} />
      </Routes>
    </ConnectionsProvider>
  );
};

export default ConnectionsApp;
