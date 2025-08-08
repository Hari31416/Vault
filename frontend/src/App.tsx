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
import TasteVaultApp from "./tools/savorscore";
import SEO from "./components/SEO";
import NuanceVaultApp from "./tools/nuancevault";
import "./App.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <SEO />
            <Navbar />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomeRedirect>
                      {/* Per page SEO override */}
                      <>
                        <SEO
                          title="Home"
                          description="Vault productivity suite: manage connections (ConnectVault) and track dining experiences (TasteVault)."
                          keywords={[
                            "vault",
                            "connectvault",
                            "tastevault",
                            "productivity tools",
                            "personal crm",
                            "restaurant ratings",
                          ]}
                          canonical="https://www.example.com/"
                        />
                        <Home />
                      </>
                    </HomeRedirect>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <>
                      <SEO title="Login" noIndex />
                      <Login />
                    </>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RegisterRoute>
                      <>
                        <SEO title="Register" noIndex />
                        <Register />
                      </>
                    </RegisterRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <>
                        <SEO title="Admin Panel" noIndex />
                        <AdminPanel />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tools/connections/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <SEO
                          title="ConnectVault"
                          description="Manage professional and personal connections, companies and positions with ConnectVault."
                          keywords={[
                            "connections manager",
                            "networking tool",
                            "personal crm",
                            "company tracker",
                          ]}
                          canonical="https://www.example.com/tools/connections"
                        />
                        <ConnectionsApp />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tools/savorscore/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <SEO
                          title="TasteVault"
                          description="Track and rate restaurants and dishes with detailed scoring in TasteVault."
                          keywords={[
                            "restaurant ratings",
                            "dish ratings",
                            "food tracker",
                            "dining log",
                            "savor score",
                          ]}
                          canonical="https://www.example.com/tools/savorscore"
                        />
                        <TasteVaultApp />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tools/nuance/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <SEO
                          title="NuanceVault"
                          description="Explore subtle distinctions among similar words: definitions, differences, examples."
                          keywords={[
                            "nuancevault",
                            "similar words",
                            "synonyms",
                            "vocabulary tool",
                          ]}
                          canonical="https://www.example.com/tools/nuance"
                        />
                        <NuanceVaultApp />
                      </>
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
