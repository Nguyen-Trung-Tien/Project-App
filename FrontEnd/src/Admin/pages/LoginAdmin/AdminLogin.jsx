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
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../../api/userApi";
import { setUser } from "../../../redux/userSlice";
import logoImage from "../../../assets/Tien-Tech Shop.png";
import ForgotPasswordModal from "../../../components/ForgotPasswordModal/ForgotPasswordModal";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(email, password);

      if (res.errCode === 0 && res.data) {
        const { user, accessToken, refreshToken } = res.data;

        if (user.role !== "admin") {
          toast.error("Bạn không có quyền admin!");
          return;
        }

        const minimalUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          phone: user.phone,
          address: user.address,
        };

        dispatch(
          setUser({ user: minimalUser, token: accessToken, refreshToken })
        );

        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        toast.success("Đăng nhập thành công!");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.errMessage || "Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page modern-login vh-100 d-flex align-items-center">
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          {/* Left Side */}
          <Col
            lg={5}
            className="d-none d-lg-flex align-items-center justify-content-center position-relative overflow-hidden bg-gradient-left"
          >
            <div className="left-overlay"></div>
            <div className="text-center text-white z-2 position-relative px-5">
              <img src={logoImage} alt="Logo" className="main-logo mb-4" />
              <p className="lead mb-5 opacity-85">
                Quản lý hệ thống cửa hàng dễ dàng
              </p>
            </div>
          </Col>

          {/* Right Side */}
          <Col
            lg={7}
            className="d-flex align-items-center justify-content-center bg-light"
          >
            <Card className="login-card-modern shadow-lg border-0 p-3">
              <Card.Body>
                <div className="text-center">
                  <img src={logoImage} alt="Logo" className="mobile-logo" />
                </div>

                <h4 className="text-center mb-3 fw-semibold text-dark">
                  Chào mừng Admin!
                </h4>

                <Form onSubmit={handleSubmit}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      id="floatingEmail"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingEmail">Email</label>
                  </Form.Floating>

                  <Form.Floating className="mb-3 position-relative">
                    <Form.Control
                      id="floatingPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingPassword">Mật khẩu</label>
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

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Ghi nhớ tôi"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <button
                      type="button"
                      className="btn btn-link text-primary p-0 fw-medium"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 fw-semibold btn-gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>

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

      <ForgotPasswordModal
        show={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default AdminLogin;
