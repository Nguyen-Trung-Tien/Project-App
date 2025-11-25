import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./FeaturedProducts.scss";
// optional: import API helper when available
// import { getFeaturedProductsApi } from "../../../api/productApi";

const FeaturedProducts = ({ categories = [], limit = 8 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // placeholder: replace with API
    const mock = Array.from({ length: limit }).map((_, i) => ({
      id: i + 1,
      title: `Sản phẩm nổi bật ${i + 1}`,
      price: 199000 + i * 5000,
      img: "/images/product-sample.png",
    }));
    setItems(mock);
    // real: fetch from API and setItems(res.data)
  }, [limit]);

  return (
    <Container fluid className="featured-products my-5">
      <div className="section-head">
        <h3>Sản phẩm nổi bật</h3>
        <p className="muted">Sản phẩm được ưa chuộng trong tuần</p>
      </div>

      <Row xs={2} md={4} className="g-3">
        {items.map((p) => (
          <Col key={p.id}>
            <Card className="product-card">
              <div className="thumb">
                <Card.Img variant="top" src={p.img} />
              </div>
              <Card.Body>
                <Card.Title className="title">{p.title}</Card.Title>
                <div className="price">{p.price.toLocaleString()}₫</div>
                <Button variant="outline-primary" size="sm">
                  Mua ngay
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturedProducts;
