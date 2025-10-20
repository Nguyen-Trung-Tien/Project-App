import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Badge,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { Cart, PersonCircle, Search } from "react-bootstrap-icons";
import "./Header.scss";

function Header() {
  const cartItemCount = 3;
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    Navigate(`/search?q=${keyword}`);
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

            <NavDropdown
              title="Sản phẩm"
              id="products-dropdown"
              className="header__dropdown"
            >
              <NavDropdown.Item as={Link} to="/category/dien-thoai">
                Điện thoại
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/laptop">
                Laptop
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/phu-kien">
                Phụ kiện
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/products">
                Tất cả sản phẩm
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/about" className="header__link">
              Giới thiệu
            </Nav.Link>
          </Nav>

          <Form className="header__search">
            <div className="header__search-box">
              <Search className="search-icon" />
              <FormControl
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="header__search-input"
                aria-label="Search"
                onChange={(e) => handleSearch(e)}
              />
            </div>
            <Button variant="primary" className="header__search-btn">
              Tìm kiếm
            </Button>
          </Form>

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
            <Nav.Link as={Link} to="/login" className="header__icon-link">
              <PersonCircle size={18} />
              <span>Đăng nhập</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
