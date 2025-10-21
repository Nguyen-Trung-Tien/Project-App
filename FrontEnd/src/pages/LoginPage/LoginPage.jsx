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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.errCode === 0) {
        dispatch(
          setUser({
            user: data.data.user,
            token: data.data.accessToken,
          })
        );
        toast.success(" Đăng nhập thành công!");

        navigate("/");
      } else {
        setError(data.errMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/");

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

                  {error && (
                    <div className="text-danger text-center mt-2">{error}</div>
                  )}
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
