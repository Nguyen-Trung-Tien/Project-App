import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { FiLock, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../Layout.scss";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập đăng nhập (sau này thay bằng gọi API thật)
    if (formData.email === "admin@shop.com" && formData.password === "123456") {
      localStorage.setItem("admin_token", "fake_jwt_token_123");
      navigate("/admin/dashboard");
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow-lg border-0 rounded-4 p-4">
              <Card.Body>
                <h3 className="text-center fw-bold mb-3">🔐 Admin Login</h3>
                <p className="text-center text-muted mb-4">
                  Đăng nhập để truy cập bảng quản trị
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FiMail />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FiLock />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 fw-semibold"
                  >
                    Đăng nhập
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    © 2025 My Online Shop. All rights reserved.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
