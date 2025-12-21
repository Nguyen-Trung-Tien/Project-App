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
import { Link } from "react-router-dom";
import logoImage from "../../assets/Tien-Tech Shop.png";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer mt-2 pt-2 pb-3">
      <Container>
        <Row className="gy-2">
          {/* Cột 1: Logo + mô tả */}
          <Col md={3} sm={6} className="text-center text-md-start">
            <Navbar.Brand as={Link} to="/" className="footer-logo mb-2">
              <img
                src={logoImage}
                alt="Tien-Tech Logo"
                className="footer-logo-img"
              />
            </Navbar.Brand>
            <p className="footer__desc">
              Cửa hàng điện tử hàng đầu Việt Nam — cung cấp sản phẩm chất lượng
              chính hãng với giá tốt nhất.
            </p>
          </Col>

          {/* Cột 2: Liên kết nhanh */}
          <Col md={3} sm={6}>
            <h6 className="footer__subtitle">Liên kết nhanh</h6>
            <ul className="footer__links">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/products">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </Col>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <Col md={3} sm={6}>
            <h6 className="footer__subtitle">Hỗ trợ khách hàng</h6>
            <ul className="footer__links">
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link to="/policy">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link to="/shipped">Vận chuyển & đổi trả</Link>
              </li>
              <li>
                <Link to="/support">Trung tâm hỗ trợ</Link>
              </li>
            </ul>
          </Col>

          {/* Cột 4: Liên hệ */}
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
