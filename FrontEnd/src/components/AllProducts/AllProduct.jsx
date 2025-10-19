import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./AllProducts.scss";
import image from "../../assets/Product.jpg";

const AllProducts = () => {
  const products = [
    {
      id: 1,
      title: "iPhone 15 Pro",
      price: 32990000,
      image: image,
    },
    {
      id: 2,
      title: "MacBook Air M3",
      price: 28990000,
      image: image,
    },
    {
      id: 3,
      title: "AirPods 3",
      price: 4590000,
      image: image,
    },
    {
      id: 4,
      title: "Apple Watch Series 9",
      price: 9990000,
      image: image,
    },
    {
      id: 5,
      title: "iPad Pro M4",
      price: 24990000,
      image: image,
    },
    {
      id: 6,
      title: "Cáp sạc USB-C",
      price: 390000,
      image: image,
    },
    {
      id: 6,
      title: "Cáp sạc USB-C",
      price: 390000,
      image: image,
    },
    {
      id: 6,
      title: "Cáp sạc USB-C",
      price: 390000,
      image: image,
    },
  ];

  return (
    <section className="all-products-section">
      <Container>
        <h2 className="section-title text-center mb-4">Tất cả sản phẩm</h2>
        <Row className="g-4 justify-content-center">
          {products.map((p) => (
            <Col key={p.id} md={3} sm={6} xs={12}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AllProducts;
