import React from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const RequireRole = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    toast.error("Not authenticated");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireRole;
