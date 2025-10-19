import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./ivateRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
