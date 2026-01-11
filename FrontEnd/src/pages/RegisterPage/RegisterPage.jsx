import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { registerUser } from "../../api/userApi";
import Loading from "../../components/Loading/Loading";
import logoImage from "../../assets/Tien-Tech Shop.png";
import "./RegisterPage.scss";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser({ username, email, phone, password });
      if (data.errCode === 0) {
        toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        toast.error(data.errMessage || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="register-page modern-register vh-100 d-flex align-items-center">
        <Container fluid className="h-100 p-0">
          <Row className="h-100 g-0">
            {/* Left Side */}
            <Col
              lg={5}
              className="d-none d-lg-flex align-items-center justify-content-center position-relative overflow-hidden bg-gradient-left"
            >
              <div className="left-overlay"></div>
              <div className="text-center text-white z-2 position-relative px-5">
                <img
                  src={logoImage}
                  alt="Tien-Tech Shop Logo"
                  className="main-logo mb-4"
                />
                <p className="lead mb-5 opacity-85">
                  Tham gia cùng chúng tôi để trải nghiệm công nghệ đỉnh cao
                </p>
              </div>
            </Col>

            {/* Right Side */}
            <Col
              lg={7}
              className="d-flex align-items-center justify-content-center bg-light"
            >
              <Card className="register-card-modern shadow-lg border-0 p-3">
                <Card.Body>
                  <div className="text-center ">
                    <img
                      src={logoImage}
                      alt="Tien-Tech Shop Logo"
                      className="mobile-logo"
                    />
                  </div>

                  <h4 className="text-center mb-3 fw-semibold text-dark">
                    Tạo tài khoản mới
                  </h4>

                  <Form onSubmit={handleRegister}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Floating>
                          <Form.Control
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Họ và tên"
                            required
                          />
                          <label htmlFor="username">Họ và tên</label>
                        </Form.Floating>
                      </Col>

                      <Col md={6}>
                        <Form.Floating>
                          <Form.Control
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                          />
                          <label htmlFor="email">Email</label>
                        </Form.Floating>
                      </Col>

                      <Col md={6}>
                        <Form.Floating>
                          <Form.Control
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="Số điện thoại"
                            required
                          />
                          <label htmlFor="phone">Số điện thoại</label>
                        </Form.Floating>
                      </Col>

                      <Col md={6}>
                        <Form.Floating className="position-relative">
                          <Form.Control
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            required
                          />
                          <label htmlFor="password">Mật khẩu</label>
                          <button
                            type="button"
                            className="btn toggle-password-modern"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </Form.Floating>
                      </Col>

                      <Col xs={12}>
                        <Form.Floating className="position-relative">
                          <Form.Control
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            required
                          />
                          <label htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                          </label>
                          <button
                            type="button"
                            className="btn toggle-password-modern"
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </Form.Floating>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      className="w-100 py-3 mt-4 fw-semibold btn-gradient"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Đăng ký"
                      )}
                    </Button>

                    <p className="text-center mt-4 text-muted">
                      Đã có tài khoản?{" "}
                      <Link to="/login" className="text-primary fw-semibold">
                        Đăng nhập ngay
                      </Link>
                    </p>

                    <div className="text-center mt-4">
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/")}
                        className="px-4"
                      >
                        ← Quay lại trang chủ
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;
