import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./RegisterPage.scss";
import { useNavigate } from "react-router";
import { registerUser } from "../../api/userApi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser({ username, email, phone, password });
      if (data.errCode === 0) {
        toast.success("Tạo tài khoản thành công!");
        navigate("/login");
      } else {
        setError(data.errMessage || "Đăng ký thất bại!");
        toast.error("Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="register-page py-5">
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="shadow-lg border-0 p-4 register-card">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold text-primary">
                Tạo tài khoản
              </h3>

              <Form onSubmit={handleRegister}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* SĐT & Mật khẩu */}
                <Row className="g-2 mt-2">
                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="password"
                      className="position-relative"
                    >
                      <Form.Label>Mật khẩu</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Xác nhận mật khẩu */}
                <Form.Group
                  controlId="confirmPassword"
                  className="mt-2 position-relative"
                >
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeSlash /> : <Eye />}
                    </button>
                  </div>
                </Form.Group>

                {error && (
                  <div className="text-danger text-center fw-semibold mt-3">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill py-2 mt-4 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>

                <p className="text-center mt-3 mb-0 text-muted">
                  Đã có tài khoản?{" "}
                  <a href="/login" className="text-primary fw-semibold">
                    Đăng nhập
                  </a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;
