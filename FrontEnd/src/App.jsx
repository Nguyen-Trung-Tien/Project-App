import { Routes, Route, Navigate } from "react-router-dom";
import LayoutComponent from "./components/LayoutComponent/LayoutComponent";
import UserRoutes from "./routes/UserRoutes";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { ToastContainer } from "react-toastify";
import AdminRoutes from "./routes/AdminRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCarts } from "./api/cartApi";
import { setCartItems } from "./redux/cartSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;

      try {
        const res = await getAllCarts();
        const userCart = res.data.find((c) => c.userId === user.id);

        if (userCart?.items) {
          dispatch(setCartItems(userCart.items));
        } else {
          dispatch(setCartItems([]));
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [user, dispatch]);

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
        position="top-center"
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
