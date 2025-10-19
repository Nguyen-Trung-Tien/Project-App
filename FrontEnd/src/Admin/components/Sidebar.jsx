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
} from "react-icons/fi";
import "../Layout.scss";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: "/admin/dashboard", icon: <FiHome size={18} />, label: "Dashboard" },
    {
      to: "/admin/orders",
      icon: <FiShoppingCart size={18} />,
      label: "Đơn hàng",
    },
    { to: "/admin/products", icon: <FiBox size={18} />, label: "Sản phẩm" },
    { to: "/admin/users", icon: <FiUsers size={18} />, label: "Người dùng" },
    {
      to: "/admin/categories",
      icon: <FiLayers size={18} />,
      label: "Danh mục",
    },
    { to: "/admin/settings", icon: <FiSettings size={18} />, label: "Cài đặt" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login-admin");
  };

  return (
    <div className="sidebar bg-dark text-white p-3 vh-100 d-flex flex-column justify-content-between">
      <div>
        <h5 className="fw-bold mb-4 text-center">🛠️ Admin Panel</h5>
        <Nav className="flex-column">
          {menuItems.map((item, i) => (
            <Nav.Link
              as={Link}
              key={i}
              to={item.to}
              className={`sidebar-link d-flex align-items-center mb-2 px-3 py-2 rounded-3 ${
                location.pathname === item.to ? "active" : ""
              }`}
            >
              {item.icon}
              <span className="ms-2">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </div>

      {/* Logout */}
      <div className="mt-3">
        <Button
          variant="outline-light"
          className="w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <FiLogOut className="me-2" /> Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
