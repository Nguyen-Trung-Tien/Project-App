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
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/userApi";
import { setUser } from "../../redux/userSlice";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAvatarBase64 } from "../../utils/decodeImage";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);

      if (res.errCode === 0 && res.data) {
        const { user, accessToken } = res.data;
        const minimalUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          phone: user.phone,
          address: user.address,
          avatar: getAvatarBase64(user.avatar),
        };
        dispatch(setUser({ user: minimalUser, token: accessToken }));
        toast.success(res.errMessage || "Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error(res.errMessage || "Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Kiểm tra lại mật khẩu và tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="login-card shadow-lg border-0 p-4">
          <Card.Body>
            <h3 className="text-center mb-4 fw-bold login-title">Đăng nhập</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group
                controlId="password"
                className="mb-3 position-relative"
              >
                <Form.Label>Mật khẩu</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Ghi nhớ tôi"
                  className="text-secondary"
                />
                <button
                  type="button"
                  className="btn btn-link text-gradient fw-semibold p-0"
                  onClick={() => setShowForgotModal(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {error && (
                <div className="text-danger text-center mb-3 fw-semibold">
                  {error}
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-100 rounded-pill py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" variant="primary" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <p className="text-center mt-4 mb-0 text-muted">
                Chưa có tài khoản?{" "}
                <a href="/register" className="text-primary fw-semibold">
                  Đăng ký ngay
                </a>
              </p>
            </Form>
          </Card.Body>

          <div className="text-center mt-3 mb-3">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/")}
              className="rounded-pill px-3 py-1"
            >
              ← Quay lại
            </Button>
          </div>
        </Card>

        <ForgotPasswordModal
          show={showForgotModal}
          onClose={() => setShowForgotModal(false)}
        />
      </Container>
    </div>
  );
};

export default LoginPage;
