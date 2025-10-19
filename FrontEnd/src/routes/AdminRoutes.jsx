import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Admin/AdminLayout";
import Dashboard from "../Admin/pages/Dashboard";
import OrderManage from "../Admin/pages/OrderManage";
import ProductManage from "../Admin/pages/ProductManage";
import UserManage from "../Admin/pages/UserManage";
import Categories from "../Admin/pages/Categories";
import Settings from "../Admin/pages/Settings";
import AdminLogin from "../Admin/pages/Login";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login-admin" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<OrderManage />} />
        <Route path="products" element={<ProductManage />} />
        <Route path="users" element={<UserManage />} />
        <Route path="categories" element={<Categories />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
