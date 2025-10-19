import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";
import "../../styles/Newsletter.scss";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <Container>
        <Envelope size={32} className="newsletter__icon mb-3" />
        <h2 className="newsletter__title">Đăng ký nhận bản tin</h2>
        <p className="newsletter__desc">
          Nhận ngay thông tin khuyến mãi, sản phẩm mới và ưu đãi độc quyền từ
          <strong> E-Store</strong>!
        </p>

        <Form className="newsletter__form mt-4 d-flex justify-content-center">
          <Form.Control
            type="email"
            placeholder="Nhập email của bạn..."
            className="newsletter__input"
          />
          <Button type="submit" className="newsletter__btn">
            Đăng ký
          </Button>
        </Form>
      </Container>
    </section>
  );
};

export default Newsletter;
