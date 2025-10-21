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
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../api/userApi";
import { setUser } from "../../redux/userSlice";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAvatarBase64 = (avatar) => {
    if (!avatar || !avatar.data) return "/default-avatar.png";
    const binary = new Uint8Array(avatar.data).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return `data:image/png;base64,${btoa(binary)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.errCode !== 0 || !response.data) {
        setError(response.errMessage || "Đăng nhập thất bại!");
        return;
      }

      const { user, accessToken, refreshToken } = response.data;

      if (user.role !== "admin") {
        setError("Tài khoản này không có quyền quản trị!");
        toast.error("Bạn không có quyền admin!");
        return;
      }

      const minimalUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: getAvatarBase64(user.avatar),
      };

      dispatch(
        setUser({ user: minimalUser, token: accessToken, refreshToken })
      );

      toast.success("Đăng nhập thành công!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
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
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
