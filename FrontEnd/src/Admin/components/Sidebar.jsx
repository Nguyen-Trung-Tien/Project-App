import React from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiLayers,
  FiSettings,
  FiLogOut,
  FiBarChart,
} from "react-icons/fi";
import "../Layout.scss";
import { useDispatch } from "react-redux";
import { logoutUserApi } from "../../api/userApi";
import { removeUser } from "../../redux/userSlice";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuItems = [
    { to: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/admin/orders", icon: <FiShoppingCart />, label: "Đơn hàng" },
    { to: "/admin/products", icon: <FiBox />, label: "Sản phẩm" },
    { to: "/admin/users", icon: <FiUsers />, label: "Người dùng" },
    { to: "/admin/revenue", icon: <FiBarChart />, label: "Doanh thu" },
    { to: "/admin/categories", icon: <FiLayers />, label: "Danh mục" },
    { to: "/admin/settings", icon: <FiSettings />, label: "Cài đặt" },
  ];

  const handleLogout = async () => {
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(removeUser());
      navigate("/admin/login-admin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div className="sidebar d-flex flex-column justify-content-between p-3 shadow-sm">
      <div className="sidebar-header mb-4 text-center">
        <h5 className="fw-bold text-primary mb-1">🛠️ Admin Panel</h5>
        <small className="text-muted">Quản lý hệ thống</small>
      </div>

      <Nav className="flex-column">
        {menuItems.map((item, i) => {
          const active = location.pathname === item.to;
          return (
            <Nav.Link
              as={Link}
              key={i}
              to={item.to}
              className={`sidebar-link d-flex align-items-center gap-2 px-3 py-2 mb-2 rounded-3 ${
                active ? "active" : ""
              }`}
            >
              <span
                className={`icon ${active ? "text-light" : "text-secondary"}`}
              >
                {item.icon}
              </span>
              <span className="fw-semibold">{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Logout */}
      <div className="mt-auto">
        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center rounded-3 py-2"
          onClick={handleLogout}
        >
          <FiLogOut className="me-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
