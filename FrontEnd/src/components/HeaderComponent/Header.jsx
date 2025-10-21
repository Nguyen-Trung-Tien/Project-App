import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Cart, PersonCircle } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../redux/userSlice";
import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector((state) => state.user.user);
  const cartItemCount = useSelector((state) => state.cart?.items?.length || 0);

  const handleLogout = () => {
    dispatch(removeUser());
    navigate("/login");
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
              <NavDropdown
                title={user.username || user.email}
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  Thông tin cá nhân
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/orders")}>
                  Đơn mua
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
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
