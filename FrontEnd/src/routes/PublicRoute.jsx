import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
