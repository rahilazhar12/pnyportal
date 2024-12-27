import React from "react";
import { Navigate } from "react-router-dom";
import { useSessionStorage } from "../../context/Sessionstorage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useSessionStorage();

  // While loading, don't render anything or show a loading spinner
  if (loading) {
    return <div>Loading...</div>; // Or return a loading spinner
  }

  // Check if user exists and their role matches one of the allowed roles
  if (!user || !allowedRoles.includes(user.role)) {
    // If not, redirect them to the login page (or another route)
    return <Navigate to="/404" />;
  }

  // If the user is authorized, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
