import React from "react";
import { Routes, Route } from "react-router-dom";
import { NuanceVaultProvider } from "./context/NuanceVaultContext";
import NuanceVaultDashboard from "./pages/NuanceVaultDashboard";

const NuanceVaultApp: React.FC = () => {
  return (
    <NuanceVaultProvider>
      <Routes>
        <Route index element={<NuanceVaultDashboard />} />
      </Routes>
    </NuanceVaultProvider>
  );
};

export default NuanceVaultApp;
