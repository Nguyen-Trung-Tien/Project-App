import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Admin/AdminLayout";
import Categories from "../Admin/pages/Categories";
import Dashboard from "../Admin/pages/Dashboard";
import AdminLogin from "../Admin/pages/Login";
import OrderManage from "../Admin/pages/OrderManage";
import ProductManage from "../Admin/pages/ProductManage";
import UserManage from "../Admin/pages/UserManage";
import PrivateRoute from "./PrivateRoute";
import Revenue from "../Admin/pages/Revenue";
import OrdersReturnPage from "../Admin/pages/OrdersReturnPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login-admin" element={<AdminLogin />} />

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
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
