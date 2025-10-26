import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section d-flex align-items-center justify-content-center">
      <div className="hero-overlay"></div>
      <div className="hero-content text-center">
        <h1 className="fw-bold hero-title">
          <span className="brand-highlight">T</span>ien-
          <span className="brand-highlight">T</span>ech
        </h1>
        <p className="hero-subtitle">
          Mua sắm thông minh – Chất lượng hàng đầu – Giá siêu ưu đãi
        </p>
        <Button className="hero-btn" onClick={() => navigate("/product-list")}>
          Khám phá ngay
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
