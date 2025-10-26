import React from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import {
  Facebook,
  Instagram,
  Youtube,
  Envelope,
  Telephone,
  GeoAlt,
} from "react-bootstrap-icons";
import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-2 pt-2 pb-3">
      <Container>
        <Row className="gy-2">
          {/* Cột 1 */}
          <Col md={3} sm={6}>
            <Navbar.Brand
              as={Link}
              to="/"
              className="header__brand fw-bold fs-4"
            >
              <span className="brand-highlight text-primary">T</span>ien-
              <span className="brand-highlight text-primary">T</span>ech
            </Navbar.Brand>
            <p className="footer__desc">
              Cửa hàng điện tử hàng đầu Việt Nam — cung cấp sản phẩm chất lượng
              chính hãng với giá tốt nhất.
            </p>
          </Col>

          {/* Cột 2 */}
          <Col md={3} sm={6}>
            <h6 className="footer__subtitle">Liên kết nhanh</h6>
            <ul className="footer__links">
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/products">Sản phẩm</a>
              </li>
              <li>
                <a href="/about">Giới thiệu</a>
              </li>
              <li>
                <a href="/contact">Liên hệ</a>
              </li>
            </ul>
          </Col>

          {/* Cột 3 */}
          <Col md={3} sm={6}>
            <h6 className="footer__subtitle">Hỗ trợ khách hàng</h6>
            <ul className="footer__links">
              <li>
                <a href="/faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="/policy">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="/shipping">Vận chuyển & đổi trả</a>
              </li>
              <li>
                <a href="/support">Trung tâm hỗ trợ</a>
              </li>
            </ul>
          </Col>

          {/* Cột 4 */}
          <Col md={3} sm={6}>
            <h6 className="footer__subtitle">Liên hệ</h6>
            <ul className="footer__contact">
              <li>
                <GeoAlt className="icon" /> 123 Nguyễn Huệ, Quận 1, TP.HCM
              </li>
              <li>
                <Telephone className="icon" /> 0123 456 789
              </li>
              <li>
                <Envelope className="icon" /> support@estore.vn
              </li>
            </ul>

            <div className="footer__social mt-2">
              <a href="#">
                <Facebook />
              </a>
              <a href="#">
                <Instagram />
              </a>
              <a href="#">
                <Youtube />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
