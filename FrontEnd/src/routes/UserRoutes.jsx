import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import CheckoutSuccess from "../pages/CheckoutSuccess/CheckoutSuccess";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import OrderHistory from "../pages/OrdersHistory/OrderHistory";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import PrivateRoute from "./PrivateRoute";
import AboutPage from "../pages/AboutPage/AboutPage";
import ProductListPage from "../pages/ProductListPage/ProductListPage";
import AllProducts from "../components/AllProducts/AllProduct";
import CheckoutFailed from "../pages/CheckoutFailed/CheckoutFailed";
import FortuneProducts from "../components/FortuneProducts/FortuneProducts";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout-success/:orderId" element={<CheckoutSuccess />} />
        <Route path="checkout-failed/:orderId" element={<CheckoutFailed />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="orders-detail/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="fortune-products" element={<FortuneProducts />} />
      </Route>
      <Route index element={<HomePage />} />
      <Route path="product-detail/:id" element={<ProductDetailPage />} />
      <Route path="product-list" element={<ProductListPage />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
