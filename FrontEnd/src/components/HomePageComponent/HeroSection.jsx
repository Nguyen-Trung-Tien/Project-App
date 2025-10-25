import React from "react";
import { Button } from "react-bootstrap";
import "../../styles/HeroSection.scss";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetAllProduct = () => {
    navigate("/product-list");
  };

  return (
    <section className="hero-section d-flex align-items-center justify-content-center">
      <div className="hero-overlay"></div>
      <div className="hero-content text-center text-light">
        <h1>
          Chào mừng đến với <span>E-Store</span>
        </h1>
        <p>Mua sắm thông minh – Chất lượng hàng đầu – Giá siêu ưu đãi</p>
        <Button className="hero-btn" onClick={handleGetAllProduct}>
          Khám phá ngay
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
