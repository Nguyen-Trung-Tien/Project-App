import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./LoginPage.scss";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    //  Gọi API đăng nhập ở đây
    console.log("Đăng nhập...");
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={5}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body>
                <h3 className="text-center mb-4 fw-bold text-primary">
                  Đăng nhập
                </h3>
                <Form onSubmit={handleSubmit}>
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

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check type="checkbox" label="Ghi nhớ tôi" />
                    <a href="#" className="text-decoration-none text-primary">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-pill py-2 fw-semibold"
                  >
                    Đăng nhập
                  </Button>
                </Form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Chưa có tài khoản?{" "}
                  <a href="/register" className="text-primary fw-semibold">
                    Đăng ký ngay
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

export default LoginPage;
