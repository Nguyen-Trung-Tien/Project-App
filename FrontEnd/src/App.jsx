import { Routes, Route, Navigate } from "react-router-dom";
import LayoutComponent from "./components/LayoutComponent/LayoutComponent";
import UserRoutes from "./routes/UserRoutes";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { ToastContainer } from "react-toastify";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  return (
    <>
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

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
