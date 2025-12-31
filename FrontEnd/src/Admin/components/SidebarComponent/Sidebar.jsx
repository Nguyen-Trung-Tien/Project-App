import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiLayers,
  FiLogOut,
  FiBarChart,
  FiDollarSign,
  FiHelpCircle,
  FiTag,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserApi } from "../../../api/userApi";
import { removeUser } from "../../../redux/userSlice";
import { clearCart } from "../../../redux/cartSlice";
import "./Sidebar.scss";
import { toast } from "react-toastify";

const MENU_ITEMS = [
  { to: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
  { to: "/admin/revenue", icon: <FiBarChart />, label: "Doanh thu" },
  { to: "/admin/orders", icon: <FiShoppingCart />, label: "Đơn hàng" },
  {
    to: "/admin/payment",
    icon: <FiDollarSign />,
    label: "Thanh toán",
  },
  { to: "/admin/products", icon: <FiBox />, label: "Sản phẩm" },
  { to: "/admin/users", icon: <FiUsers />, label: "Người dùng" },
  { to: "/admin/brands", icon: <FiTag />, label: "Thương hiệu" },
  { to: "/admin/categories", icon: <FiLayers />, label: "Danh mục" },
  { to: "/admin/reviews", icon: <FiHelpCircle />, label: "Phản hồi" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut || !user) return;
    setLoggingOut(true);
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(removeUser());
      dispatch(clearCart());
      navigate("/admin/login", { replace: true });
      toast.success("Đăng xuất thành công!");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="sidebar d-flex flex-column justify-content-between p-3 shadow-sm bg-white">
      <div>
        <div className="sidebar-header mb-4 text-center">
          <h5 className="fw-bold text-primary mb-1">Admin Panel</h5>
          <small className="text-muted">Quản lý hệ thống</small>
        </div>

        <Nav className="flex-column">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Nav.Link
                as={Link}
                key={item.to}
                to={item.to}
                className={`sidebar-link d-flex align-items-center gap-2 px-3 py-2 mb-2 rounded-3 transition-all ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="icon">{item.icon}</span>
                <span className="fw-semibold">{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      <div className="mt-auto">
        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center rounded-3 py-2 fw-medium"
          onClick={handleLogout}
          disabled={loggingOut}
          title="Đăng xuất"
        >
          <FiLogOut className="me-2" />
          {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
