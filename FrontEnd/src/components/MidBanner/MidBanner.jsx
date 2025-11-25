import React from "react";
import { Container } from "react-bootstrap";
import "./MidBanner.scss";

const MidBanner = () => {
  return (
    <Container fluid className="mid-banner my-5">
      <div className="banner-wrap">
        <img src="/images/mid-banner.jpg" alt="mid-banner" />
        <div className="banner-content">
          <h2>Ưu đãi mùa lễ - Giảm tới 50%</h2>
          <p>Ưu đãi có giới hạn, mua ngay kẻo lỡ</p>
        </div>
      </div>
    </Container>
  );
};

export default MidBanner;
