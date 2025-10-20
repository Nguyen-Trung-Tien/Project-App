import React from "react";
import { Button } from "react-bootstrap";
import "../../styles/HeroSection.scss";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleGetAllProduct = () => {
    navigate("/products");
  };
  return (
    <section className="hero-section text-center text-light d-flex flex-column justify-content-center align-items-center">
      <div className="hero-content">
        <h1>
          Chào mừng đến với <span>E-Store</span>
        </h1>
        <p>Mua sắm thông minh – Chất lượng hàng đầu – Giá siêu ưu đãi</p>
        <Button
          variant="primary"
          className="hero-btn"
          onClick={() => {
            handleGetAllProduct();
          }}
        >
          Khám phá ngay
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
