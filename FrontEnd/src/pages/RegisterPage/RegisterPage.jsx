import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./RegisterPage.scss";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Đăng ký...");
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="register-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="register-card shadow-lg border-0">
              <Card.Body>
                <h3 className="text-center mb-4 fw-bold text-primary">
                  Tạo tài khoản
                </h3>

                <Form onSubmit={handleRegister}>
                  <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-pill py-2 fw-semibold"
                  >
                    Đăng ký
                  </Button>
                </Form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Đã có tài khoản?{" "}
                  <a href="/login" className="text-primary fw-semibold">
                    Đăng nhập ngay
                  </a>
                </p>
              </Card.Body>
              <div className="text-center mt-3">
                <Button
                  variant="outline-secondary"
                  onClick={handleBack}
                  className="rounded-pill px-3 py-1"
                >
                  ← Quay lại trang chủ
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
