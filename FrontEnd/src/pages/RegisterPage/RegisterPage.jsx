import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./RegisterPage.scss";
import { useNavigate } from "react-router";
import { registerUser } from "../../api/userApi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError(" Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }
    try {
      const data = await registerUser({ username, email, phone, password });

      if (data.errCode === 0) {
        toast.success("Tạo tài khoản thành công!");
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại!");
        setError(data.errMessage || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      {loading && <Loading />}
      <div className="register-page">
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Row className="w-100 justify-content-center">
            <Col md={5} lg={5}>
              <Card className="register-card shadow-lg border-0">
                <Card.Body>
                  <h3 className="text-center mb-4 fw-bold text-primary">
                    Tạo tài khoản
                  </h3>

                  <Form onSubmit={handleRegister}>
                    <Form.Group controlId="username" className="mb-1">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-1">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email"
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="phone" className="mb-1">
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Phone number"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-1">
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

                    {error && <div className="text-danger mb-3">{error}</div>}

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-pill py-2 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </Form>

                  <p className="text-center mt-4 mb-0 text-muted">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-primary fw-semibold">
                      Đăng nhập ngay
                    </a>
                  </p>
                </Card.Body>

                <Card.Footer className="bg-white border-0 text-center pb-3">
                  <Button
                    variant="outline-secondary"
                    onClick={handleBack}
                    className="rounded-pill px-3 py-1"
                  >
                    ← Quay lại trang chủ
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;
