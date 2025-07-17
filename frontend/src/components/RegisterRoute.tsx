import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RegisterRouteProps {
  children: React.ReactNode;
}

const RegisterRoute: React.FC<RegisterRouteProps> = ({ children }) => {
  const { user, hasAnyUsers, isLoading } = useAuth();

  if (isLoading || hasAnyUsers === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If no users exist, allow anyone to register (cold start)
  if (hasAnyUsers === false) {
    return <>{children}</>;
  }

  // If users exist, only allow admins to register new users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RegisterRoute;
