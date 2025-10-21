import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import CheckoutSuccess from "../pages/CheckoutSuccess/CheckoutSuccess";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import AllProducts from "../components/AllProducts/AllProduct";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import OrderHistory from "../pages/OrdersHistory/OrderHistory";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderDetail from "../pages/OrderDetail/OrderDetail";

const UserRoutes = () => {
  return (
    <Routes>
      {/* Chỉ dành cho người chưa đăng nhập */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Chỉ dành cho người đã đăng nhập */}
      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders-detail" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Các route công khai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/product-detail" element={<ProductDetailPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
