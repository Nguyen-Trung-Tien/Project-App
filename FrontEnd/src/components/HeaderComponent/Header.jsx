import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Cart, PersonCircle, Search, XLg } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../redux/userSlice";
import { clearCart, setCartItems } from "../../redux/cartSlice";
import { logoutUserApi } from "../../api/userApi";
import { searchSuggestionsApi } from "../../api/productApi";
import { getAllCarts } from "../../api/cartApi";
import { getImage } from "../../utils/decodeImage";
import { useCurrentUser } from "../../hooks/useUser";
import { debounce } from "lodash";
import "./Header.scss";
import logoImage from "../../assets/Tien-Tech Shop.png";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState({
    products: [],
    keywords: [],
    brands: [],
    categories: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: resUser } = useCurrentUser();
  const user = resUser?.data;
  const token = localStorage.getItem("accessToken");

  const cartItemCount = useSelector(
    (state) =>
      state.cart.cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
  );

  const avatarUrl = user?.avatar?.startsWith("data:image")
    ? user.avatar
    : "/default-avatar.png";

  // Fetch Cart
  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      if (!user?.id || !token) return;

      try {
        const res = await getAllCarts(token);
        const userCart = res.data.find((c) => c.userId === user.id);

        if (isMounted) {
          if (userCart?.items) dispatch(setCartItems(userCart.items));
          else dispatch(clearCart());
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, [user?.id, token, dispatch]);

  // Search Suggestion Debounce
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions({
          products: [],
          keywords: [],
          brands: [],
          categories: [],
        });
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await searchSuggestionsApi(query);
        setSuggestions(res?.suggestions || {});
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search suggest error:", err);
      }
    }, 300),
    []
  );

  const handleLogout = async () => {
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      dispatch(removeUser());
      dispatch(clearCart());
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      setShowSuggestions(false);
      navigate("/");
      return;
    }
    fetchSuggestions(value);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setShowSuggestions(false);
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
        <Navbar.Brand as={Link} to="/" className="navbar-brand ">
          <img
            className="header-logo"
            src={logoImage}
            alt="Tien-Tech Shop Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="header__link">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/fortune-products" className="header__link">
              Phong thủy
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="header__link">
              Giới thiệu
            </Nav.Link>
          </Nav>

          {/* Search */}
          <form
            onSubmit={onSearchSubmit}
            className="search-wrapper position-relative d-flex align-items-center w-50"
          >
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchInput}
              onChange={onSearchChange}
              className="form-control search-input"
            />
            {searchInput.length > 0 && (
              <button
                type="button"
                className="btn-clear"
                onClick={() => {
                  setSearchInput("");
                  setShowSuggestions(false);
                  navigate("/");
                }}
              >
                <XLg size={16} />
              </button>
            )}

            {showSuggestions && (
              <div className="search-suggestion-box shadow-sm">
                {["keywords", "products", "brands", "categories"].map(
                  (type) =>
                    suggestions[type]?.length > 0 && (
                      <div key={type} className="suggest-section">
                        <div className="suggest-title">
                          {type === "keywords"
                            ? "Gợi ý tìm kiếm"
                            : type === "products"
                            ? "Sản phẩm phù hợp"
                            : type === "brands"
                            ? "Thương hiệu"
                            : "Danh mục"}
                        </div>
                        {suggestions[type].map((item) => {
                          const label =
                            type === "products" ? item.name : item.name || item;
                          const clickHandler = () => {
                            if (type === "products")
                              navigate(`/product-detail/${item.id}`);
                            else if (type === "brands")
                              navigate(`/product-list?brand=${item.id}`);
                            else if (type === "categories")
                              navigate(`/product-list?category=${item.id}`);
                            else
                              navigate(
                                `/products?search=${encodeURIComponent(item)}`
                              );
                            setShowSuggestions(false);
                          };
                          return (
                            <div
                              key={item.id || item}
                              className={
                                type === "products"
                                  ? "suggest-product-item"
                                  : "suggest-item"
                              }
                              onClick={clickHandler}
                            >
                              {type === "products" && (
                                <img
                                  src={getImage(item.image)}
                                  alt=""
                                  className="suggest-img"
                                />
                              )}
                              <span>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )
                )}
              </div>
            )}
          </form>

          {/* User & Cart */}
          <Nav className="header__actions align-items-center">
            <Nav.Link
              as={Link}
              to="/cart"
              className="header__icon-link position-relative"
            >
              <Cart size={20} className="me-1" /> Giỏ hàng
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
                      Đơn hàng
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Sản phẩm
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown
                  align="end"
                  title={
                    <div className="d-flex align-items-center">
                      <Image
                        src={avatarUrl}
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
                    Đơn mua
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
