import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterRoute from "./components/RegisterRoute";
import HomeRedirect from "./components/HomeRedirect";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ConnectionsApp from "./tools/connections";
import "./App.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
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
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
