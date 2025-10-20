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

const HeaderAdmin = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-3 sticky-top">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Logo */}
        <Navbar.Brand className="fw-bold text-primary fs-4">
          🧭 Admin Dashboard
        </Navbar.Brand>

        {/* Thanh tìm kiếm */}
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

        {/* Khu vực phải */}
        <div className="d-flex align-items-center gap-3">
          {/* Nút thông báo */}
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

          {/* Dropdown tài khoản */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
            >
              <Image
                src="/images/avatar-default.png"
                alt="Admin Avatar"
                roundedCircle
                width={32}
                height={32}
              />
              <span className="fw-semibold">Admin</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profile">
                <PersonCircle className="me-2" /> Hồ sơ
              </Dropdown.Item>
              <Dropdown.Item href="#/logout" className="text-danger">
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
