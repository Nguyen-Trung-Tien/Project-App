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
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import { getAvatarBase64 } from "../../utils/decodeImage";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      if (response.errCode === 0 && response.data) {
        const { user, accessToken } = response.data;
        const minimalUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          avatar: getAvatarBase64(user.avatar),
        };
        dispatch(setUser({ user: minimalUser, token: accessToken }));
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error(response.errMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>
                  </Form>

                  <p className="text-center mt-4 mb-0 text-muted">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-primary fw-semibold">
                      Đăng ký ngay
                    </a>
                  </p>
                </Card.Body>

                <div className="text-center mt-3 mb-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/")}
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
    </>
  );
};

export default LoginPage;
