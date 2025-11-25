import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // TODO: gọi API subscribe
    alert(`Cảm ơn! Đã đăng ký ${email}`);
    setEmail("");
  };

  return (
    <Container fluid className="newsletter my-5">
      <div className="newsletter-wrap">
        <h4>Nhận ngay ưu đãi khi đăng ký</h4>
        <p>Nhập email để nhận voucher và thông báo khuyến mãi</p>
        <Form onSubmit={submit} className="d-flex gap-2">
          <Form.Control
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Đăng ký</Button>
        </Form>
      </div>
    </Container>
  );
};

export default Newsletter;
