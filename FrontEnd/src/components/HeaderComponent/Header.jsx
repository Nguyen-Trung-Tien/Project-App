import React from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Cart, PersonCircle } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../redux/userSlice";
import "./Header.scss";
import { logoutUserApi } from "../../api/userApi";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const cartItemCount = useSelector((state) =>
    state.cart.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  );
  const avatarUrl = user?.avatar || "/default-avatar.png";
  const handleLogout = async () => {
    try {
      await logoutUserApi();
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Navbar expand="lg" sticky="top" className="header shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="header__brand">
          <span className="brand-highlight">E</span>-Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto header__nav">
            <Nav.Link as={Link} to="/" className="header__link">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="header__link">
              Giới thiệu
            </Nav.Link>
          </Nav>

          <Nav className="header__actions">
            <Nav.Link as={Link} to="/cart" className="header__icon-link">
              <Cart size={18} />
              <span>Giỏ hàng</span>
              {cartItemCount > 0 && (
                <Badge bg="danger" pill className="ms-1">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <NavDropdown title="Quản lý hệ thống" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      Quản lý đơn hàng
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Quản lý sản phẩm
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Quản lý người dùng
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Quản lý danh mục
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/revenue">
                      Quản lý báo cáo
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        className="me-2 header__avatar"
                      />
                      <span>{user.username || user.email}</span>
                    </div>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Thông tin cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/orders")}>
                    Đơn mua
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/orders-detail")}>
                    Chi tiết đơn hàng
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/order-history")}>
                    Lịch sử đơn hàng
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="header__icon-link">
                <PersonCircle size={18} />
                <span>Đăng nhập</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
