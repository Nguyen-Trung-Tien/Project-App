import React, { useState } from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  Search,
  PersonCircle,
  BoxArrowRight,
  House,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { logoutUserApi } from "../../../api/userApi";
import { removeUser } from "../../../redux/userSlice";
import { clearCart } from "../../../redux/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../../hooks/useUser";
import logoImage from "../../../assets/Tien-Tech Shop.png";
import "./HeaderAdmin.scss";

const HeaderAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: resUser } = useCurrentUser();
  const user = resUser?.data;

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName =
    user?.username?.length > 15
      ? user.username.slice(0, 15) + "..."
      : user?.username || user?.email || "Admin";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!");
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
        <Navbar.Brand
          className="fw-bold text-primary fs-4 d-flex align-items-center gap-2 cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img src={logoImage} alt="Logo" className="header-logo" />
          Admin Dashboard
        </Navbar.Brand>

        <Button
          variant="outline-secondary"
          className="d-md-none me-2"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search size={18} />
        </Button>

        <Form
          className={`d-${
            showSearch ? "flex" : "none d-md-flex"
          } align-items-center flex-grow-1 mx-3`}
          onSubmit={handleSearch}
          style={{ maxWidth: "400px" }}
        >
          <div className="input-group w-100">
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} />
            </span>
            <FormControl
              type="search"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-start-0"
            />
            {searchQuery && (
              <Button
                variant="light"
                className="btn-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </Button>
            )}
          </div>
        </Form>

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
              <PersonCircle />
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
