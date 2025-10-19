import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CheckoutSuccess from "../pages/CheckoutSuccess/CheckoutSuccess";
import OrderHistory from "../pages/Orders/OrderHistory";
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order-detail" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
