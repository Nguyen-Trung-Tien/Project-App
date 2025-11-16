import React, { useState } from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap";
import {
  Search,
  PersonCircle,
  BoxArrowRight,
  House,
} from "react-bootstrap-icons";
import "./HeaderAdmin.scss";
import { removeUser } from "../../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUserApi } from "../../../api/userApi";
import { clearCart } from "../../../redux/cartSlice";

const HeaderAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const avatarUrl = user?.avatar ? user.avatar : "/default-avatar.png";
  const displayName = user?.username || user?.email || "Admin";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(removeUser());
      dispatch(clearCart());
      navigate("/admin/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-3 sticky-top">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <Navbar.Brand className="fw-bold text-primary fs-4 d-flex align-items-center gap-2">
          Admin Dashboard
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-md-none"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search size={18} />
          </Button>

          <Form
            className={`d-${
              showSearch ? "flex" : "none d-md-flex"
            } align-items-center flex-grow-1`}
            style={{ maxWidth: "400px" }}
            onSubmit={handleSearch}
          >
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={18} />
              </span>
              <FormControl
                type="search"
                placeholder="Tìm kiếm..."
                className="border-start-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Form>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/")}
            title="Về trang chủ"
            className="d-flex align-items-center gap-1"
          >
            <House size={18} />
            <span className="d-none d-xl-inline">Home</span>
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
              id="user-dropdown"
            >
              <Image
                src={avatarUrl}
                alt="Avatar"
                roundedCircle
                width={32}
                height={32}
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
              <span className="fw-semibold d-none d-sm-inline">
                {displayName}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/profile")}>
                <PersonCircle className="me-2" /> Hồ sơ
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                className="text-danger"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <BoxArrowRight className="me-2" />
                {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default HeaderAdmin;
