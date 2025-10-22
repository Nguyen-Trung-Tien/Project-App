import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "../../styles/ProductSection.scss";
import { getAllProductApi } from "../../api/productApi";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProductApi();
        if (res?.errCode === 0) {
          // 🔹 Lọc ra 4 sản phẩm đầu tiên hoặc nổi bật
          const featured = res.products?.filter((p) => p.isActive)?.slice(0, 4);
          setProducts(featured);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
                <Card.Img
                  variant="top"
                  src={
                    item.image
                      ? `data:image/jpeg;base64,${item.image}`
                      : "/default-product.jpg"
                  }
                  alt={item.name}
                />
                <Card.Body>
                  <h5 className="mb-2">{item.name}</h5>
                  <p className="price">
                    {Number(item.price).toLocaleString("vi-VN")}₫
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill w-100"
                  >
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
