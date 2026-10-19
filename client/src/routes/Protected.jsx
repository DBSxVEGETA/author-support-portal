import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading)
    return (
      <div className="loading-screen">
        <div className="leaf-mark">b</div>
        <span>Preparing your workspace…</span>
      </div>
    );
  if (!user)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  if (!admin && user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

export default Protected;
