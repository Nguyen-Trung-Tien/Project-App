import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Brands.scss";

// Dữ liệu mẫu
const brands = [
  { id: 1, name: "Apple", logo: "/images/brands/apple.png" },
  { id: 2, name: "Samsung", logo: "/images/brands/samsung.png" },
  { id: 3, name: "Xiaomi", logo: "/images/brands/xiaomi.png" },
  { id: 4, name: "Sony", logo: "/images/brands/sony.png" },
  { id: 5, name: "Dell", logo: "/images/brands/dell.png" },
  { id: 6, name: "HP", logo: "/images/brands/hp.png" },
];

const Brands = () => {
  return (
    <div className="brands-section py-3 bg-light">
      <Container>
        <h3 className="text-center mb-4 fw-bold">🌟 Thương hiệu nổi bật</h3>
        <Row className="g-4 justify-content-center">
          {brands.map((brand) => (
            <Col key={brand.id} xs={6} sm={4} md={2} className="text-center">
              <Card className="brand-card shadow-sm border-0 p-3">
                <Card.Img
                  variant="top"
                  src={brand.logo}
                  alt={brand.name}
                  className="brand-logo img-fluid"
                />
                <Card.Body className="p-0 mt-2">
                  <small className="text-muted">{brand.name}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Brands;
