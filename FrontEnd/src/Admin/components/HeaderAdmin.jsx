import React from "react";
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
  Bell,
  Search,
  PersonCircle,
  BoxArrowRight,
} from "react-bootstrap-icons";
import "../Layout.scss";
import { removeUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUserApi } from "../../api/userApi";

const HeaderAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const avatarUrl = user?.avatar || "/default-avatar.png";
  const handleLogout = async () => {
    try {
      await logoutUserApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(removeUser());
      navigate("/admin/login-admin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-3 sticky-top">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <Navbar.Brand className="fw-bold text-primary fs-4">
          🧭 Admin Dashboard
        </Navbar.Brand>

        <Form
          className="d-none d-md-flex align-items-center"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} />
            </span>
            <FormControl
              type="search"
              placeholder="Tìm kiếm..."
              className="border-start-0"
            />
          </div>
        </Form>

        <div className="d-flex align-items-center gap-3">
          {/* Nút Home */}
          <Button
            variant="outline-primary"
            onClick={() => navigate("/")}
            className="d-flex align-items-center gap-1"
          >
            🏠 Home
          </Button>

          <Button
            variant="outline-primary"
            className="rounded-circle p-2 position-relative"
          >
            <Bell size={20} />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.6rem" }}
            >
              3
            </span>
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
            >
              <Image
                src={avatarUrl}
                alt="Admin Avatar"
                roundedCircle
                width={32}
                height={32}
              />
              <span className="fw-semibold">Admin</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/profile")}>
                <PersonCircle className="me-2" /> Hồ sơ
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={() => handleLogout()}
              >
                <BoxArrowRight className="me-2" /> Đăng xuất
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default HeaderAdmin;
