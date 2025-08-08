import React from "react";
import { Routes, Route } from "react-router-dom";
import { NuanceVaultProvider } from "./context/NuanceVaultContext";
import { GamificationProvider } from "./context/GamificationContext";
import NuanceVaultDashboard from "./pages/NuanceVaultDashboard";

const NuanceVaultApp: React.FC = () => {
  return (
    <NuanceVaultProvider>
      <GamificationProvider>
        <Routes>
          <Route index element={<NuanceVaultDashboard />} />
        </Routes>
      </GamificationProvider>
    </NuanceVaultProvider>
  );
};

export default NuanceVaultApp;
