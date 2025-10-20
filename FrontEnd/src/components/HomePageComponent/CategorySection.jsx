import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../styles/CategorySection.scss";
import image from "../../assets/Product.jpg";

const CategorySection = () => {
  const categories = [
    { title: "Điện thoại", img: image },
    { title: "Laptop", img: image },
    { title: "Phụ kiện", img: image },
  ];

  return (
    <Container className="categories my-2">
      <h2 className="section-title text-center mb-2">Danh mục nổi bật</h2>
      <Row className="g-4 justify-content-center">
        {categories.map((item, index) => (
          <Col md={4} sm={6} xs={12} key={index}>
            <div className="category-card">
              <img src={item.img} alt={item.title} />
              <div className="overlay">
                <h5>{item.title}</h5>
                <Button variant="light" size="sm">
                  Xem ngay
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategorySection;
