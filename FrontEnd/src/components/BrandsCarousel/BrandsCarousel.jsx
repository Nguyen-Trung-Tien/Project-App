import React from "react";
import { Container } from "react-bootstrap";
import "./BrandsCarousel.scss";

const BrandsCarousel = ({ brands = [] }) => {
  const defaultBrands = [
    "/images/brand1.png",
    "/images/brand2.png",
    "/images/brand3.png",
    "/images/brand4.png",
    "/images/brand5.png",
  ];

  const items = brands.length ? brands : defaultBrands;

  return (
    <Container fluid className="brands-carousel my-4">
      <div className="brands-wrap">
        {items.map((b, i) => (
          <div className="brand-item" key={i}>
            <img src={b} alt={`brand-${i}`} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BrandsCarousel;
