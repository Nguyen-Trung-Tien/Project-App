import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
