import React from "react";
import { Routes, Route } from "react-router-dom";
import { SavorScoreProvider } from "./context/SavorScoreContext";
import SavorScoreDashboard from "./pages/SavorScoreDashboard";
import RestaurantDetail from "./pages/RestaurantDetail";
import DishDetail from "./pages/DishDetail";
import RatingDetail from "./pages/RatingDetail";
import AnalyticsPage from "./pages/AnalyticsPage";

const SavorScoreApp: React.FC = () => {
  return (
    <SavorScoreProvider>
      <Routes>
        <Route path="/" element={<SavorScoreDashboard />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/dish/:id" element={<DishDetail />} />
        <Route path="/rating/:id" element={<RatingDetail />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </SavorScoreProvider>
  );
};

export default SavorScoreApp;
