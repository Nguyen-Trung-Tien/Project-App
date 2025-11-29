import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Admin/AdminLayout";
import Categories from "../Admin/pages/Categories/Categories";
import Dashboard from "../Admin/pages/Dashboard/Dashboard";
import AdminLogin from "../Admin/pages/LoginAdmin/Login";
import OrderManage from "../Admin/pages/OrderManage/OrderManage";
import ProductManage from "../Admin/pages/ProductManage/ProductManage";
import UserManage from "../Admin/pages/UserManage/UserManage";
import Revenue from "../Admin/pages/Revenue/Revenue";
import OrdersReturnPage from "../Admin/pages/OrdersReturnPage/OrdersReturnPage";
import PrivateRoute from "./PrivateRoute";
import PaymentPage from "../Admin/pages/Payment/PaymentPage";
import ReviewPage from "../Admin/pages/ReviewPage/ReviewPage";
import BrandManage from "../Admin/pages/BrandManage/BrandManage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<PrivateRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<OrderManage />} />
          <Route path="orders-return/:id" element={<OrdersReturnPage />} />
          <Route path="products" element={<ProductManage />} />
          <Route path="users" element={<UserManage />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="categories" element={<Categories />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="brands" element={<BrandManage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
