import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LayoutComponent from "./components/LayoutComponent/LayoutComponent";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LayoutComponent isShowHeader={false} isShowFooter={false}>
            <LoginPage />
          </LayoutComponent>
        }
      />

      <Route
        path="/register"
        element={
          <LayoutComponent isShowHeader={false} isShowFooter={false}>
            <RegisterPage />
          </LayoutComponent>
        }
      />

      <Route
        path="/*"
        element={
          <LayoutComponent isShowHeader={true} isShowFooter={true}>
            <UserRoutes />
          </LayoutComponent>
        }
      />

      <Route
        path="/admin/*"
        element={
          <LayoutComponent isShowHeader={false} isShowFooter={false}>
            <AdminRoutes />
          </LayoutComponent>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
