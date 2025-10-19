import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/HeaderComponent/Header";
import Footer from "./components/FooterComponent/Footer";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const location = useLocation();

  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/admin",
    "/admin/dashboard",
    "/admin/orders",
    "/admin/products",
    "/admin/users",
  ];
  const shouldHideHeader = hideHeaderRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!shouldHideHeader && <Footer />}
    </>
  );
}

export default App;
