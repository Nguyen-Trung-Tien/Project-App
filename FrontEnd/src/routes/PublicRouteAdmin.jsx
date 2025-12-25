import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRouteAdmin = () => {
  const user = useSelector((state) => state.user.user);

  if (user && user.role === "admin") return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default PublicRouteAdmin;
