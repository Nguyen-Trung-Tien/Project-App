import React, { useState, useCallback } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Cart, PersonCircle, Search } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../redux/userSlice";
import { logoutUserApi } from "../../api/userApi";
import { debounce } from "lodash";
import "./Header.scss";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const user = useSelector((state) => state.user.user);
  const cartItemCount = useSelector(
    (state) =>
      state.cart.cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
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

  const handleSearchDebounced = useCallback(
    debounce((query) => {
      if (query.trim())
        navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }, 300),
    []
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearchDebounced(value);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
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

          <form
            onSubmit={onSearchSubmit}
            className="d-flex align-items-center me-3 search-wrapper"
          >
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchInput}
              onChange={onSearchChange}
              className="form-control"
            />
            <Button type="submit" variant="outline-light" className="ms-2">
              Tìm
            </Button>
          </form>

          <Nav className="header__actions">
            {/* Cart */}
            <Nav.Link as={Link} to="/cart" className="header__icon-link">
              <Cart size={22} />
              {cartItemCount > 0 && (
                <Badge bg="danger" pill className="cart-badge">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <NavDropdown title="Quản lý" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      Quản lý đơn hàng
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Quản lý sản phẩm
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Quản lý người dùng
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/categories">
                      Quản lý danh mục
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/revenue">
                      Báo cáo
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        className="header__avatar me-2"
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
                <PersonCircle size={22} />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
