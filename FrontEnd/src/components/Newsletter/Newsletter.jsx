import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert(`Cảm ơn! Đã đăng ký ${email}`);
    setEmail("");
  };

  return (
    <Container fluid className="newsletter">
      <Container>
        <Row className="align-items-center newsletter-box">
          {/* Text */}
          <Col md={6} className="mb-3 mb-md-0">
            <h4>Nhận ưu đãi mỗi ngày</h4>
            <p>Đăng ký email để nhận voucher & khuyến mãi mới nhất</p>
          </Col>

          {/* Form */}
          <Col md={6}>
            <Form onSubmit={submit} className="newsletter-form">
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">Đăng ký</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Newsletter;
