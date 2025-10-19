import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/ProductSection.scss";
import productImg from "../../assets/Product.jpg";

const ProductSection = () => {
  const products = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      price: 32990000,
      img: productImg,
    },
    {
      id: 2,
      title: "MacBook Air M3 2024",
      price: 28990000,
      img: productImg,
    },
    {
      id: 3,
      title: "Tai nghe AirPods Pro 2",
      price: 5290000,
      img: productImg,
    },
    {
      id: 4,
      title: "Apple Watch Series 10",
      price: 11990000,
      img: productImg,
    },
  ];

  return (
    <section className="products py-5">
      <Container>
        <h2 className="section-title text-center mb-4">
          ✨ Sản phẩm nổi bật ✨
        </h2>
        <Row className="g-4 justify-content-center">
          {products.map((item) => (
            <Col lg={3} md={4} sm={6} xs={12} key={item.id}>
              <Card className="product-card shadow-sm">
                <Card.Img variant="top" src={item.img} alt={item.title} />
                <Card.Body>
                  <h5 className="mb-2">{item.title}</h5>
                  <p className="price">{item.price.toLocaleString("vi-VN")}₫</p>
                  <Button variant="primary" size="sm" className="rounded-pill">
                    <i className="bi bi-cart-plus me-2"></i>
                    Thêm vào giỏ
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;
