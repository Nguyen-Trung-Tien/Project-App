import React, { useState, useCallback, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Cart, PersonCircle, Search } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../redux/userSlice";
import { logoutUserApi } from "../../api/userApi";
import { debounce } from "lodash";
import "./Header.scss";
import { getAllCarts } from "../../api/cartApi";
import { clearCart, setCartItems } from "../../redux/cartSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;

  const cartItemCount = useSelector(
    (state) =>
      state.cart.cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
  );

  const avatarUrl = user?.avatar || "/default-avatar.png";

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;

      try {
        const res = await getAllCarts(token);
        const userCart = res.data.find((c) => c.userId === user.id);

        if (userCart && userCart.items) {
          dispatch(setCartItems(userCart.items));
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [user, dispatch]);
  const handleLogout = async () => {
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(removeUser());
      dispatch(clearCart());
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
    <Navbar
      expand="lg"
      sticky="top"
      bg="light"
      variant="light"
      className="header shadow-sm py-2"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand fw-bold">
          <span style={{ color: "#007bff" }}>T</span>ien-
          <span style={{ color: "#007bff" }}>T</span>ech
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="header__link">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="header__link">
              Giới thiệu
            </Nav.Link>
          </Nav>

          <form
            onSubmit={onSearchSubmit}
            className="d-flex align-items-center me-3 search-wrapper w-50"
          >
            <Search className="search-icon position-absolute" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchInput}
              onChange={onSearchChange}
              className="form-control"
            />
          </form>

          <Nav className="header__actions align-items-center">
            <Nav.Link
              as={Link}
              to="/cart"
              className="header__icon-link position-relative"
            >
              <Cart size={20} className="me-1" />
              Giỏ hàng
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
                  align="end"
                  title={
                    <div className="d-flex align-items-center">
                      <Image
                        src={avatarUrl}
                        key={avatarUrl}
                        alt="avatar"
                        roundedCircle
                        width="32"
                        height="32"
                        className="me-2"
                      />
                      <span className="fw-semibold">
                        {user.username || user.email}
                      </span>
                    </div>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Thông tin cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/orders")}>
                    Đơn hàng
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
              <Nav.Link
                as={Link}
                to="/login"
                className="header__icon-link ms-2"
              >
                <PersonCircle size={22} className="me-1" /> Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
