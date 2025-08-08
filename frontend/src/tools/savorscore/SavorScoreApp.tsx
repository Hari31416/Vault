import React from "react";
import { Routes, Route } from "react-router-dom";
import { SavorScoreProvider } from "./context/SavorScoreContext";
import SavorScoreDashboard from "./pages/SavorScoreDashboard";

const SavorScoreApp: React.FC = () => {
  return (
    <SavorScoreProvider>
      <Routes>
        <Route path="/" element={<SavorScoreDashboard />} />
        {/* Add more routes later for restaurant/dish details pages */}
      </Routes>
    </SavorScoreProvider>
  );
};

export default SavorScoreApp;
