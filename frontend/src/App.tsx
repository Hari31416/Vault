import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterRoute from "./components/RegisterRoute";
import HomeRedirect from "./components/HomeRedirect";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ConnectionsApp from "./tools/connections";
import SavorScoreApp from "./tools/savorscore";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <HomeRedirect>
                    <Home />
                  </HomeRedirect>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/register"
                element={
                  <RegisterRoute>
                    <Register />
                  </RegisterRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/connections/*"
                element={
                  <ProtectedRoute>
                    <ConnectionsApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/savorscore/*"
                element={
                  <ProtectedRoute>
                    <SavorScoreApp />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
