import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const getDefaultRouteByRole = (role) => {
  switch (String(role || "").toUpperCase()) {
    case "ADMIN":
      return "/admin/review";
    case "TEACHER":
      return "/teacher/courses";
    case "STUDENT":
    default:
      return "/";
  }
};

export function RoleRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = String(user?.role || "STUDENT").toUpperCase();
  const normalizedAllowedRoles = Array.isArray(allowedRoles)
    ? allowedRoles.map((role) => String(role).toUpperCase())
    : [];

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to={getDefaultRouteByRole(userRole)} replace />;
  }

  return children;
}