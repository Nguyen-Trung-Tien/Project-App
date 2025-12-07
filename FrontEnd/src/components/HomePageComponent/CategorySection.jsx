import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CategorySection.scss";
import SkeletonCard from "../SkeletonCard/SkeletonCard";

const CategorySection = React.memo(({ categories = [], loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Container className="categories my-2">
        <h2 className="section-title text-center mb-2">✨Danh Mục✨</h2>
        <Row className="g-2 justify-content-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} lg={2} md={3} sm={4} xs={6}>
              <SkeletonCard />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container className="categories my-3">
      <h2 className="section-title text-center mb-3">✨Danh Mục✨</h2>
      <Row className="g-3 justify-content-center">
        {categories.map((cat) => (
          <Col key={cat.id} lg={2} md={3} sm={4} xs={6}>
            <div
              className="category-card"
              onClick={() => navigate(`/product-list?category=${cat.id}`)}
            >
              <div className="image-wrapper">
                <img
                  src={
                    cat.imageUrl ||
                    (cat.image
                      ? `data:image/jpeg;base64,${cat.image}`
                      : "/images/default-category.jpg")
                  }
                  alt={cat.name}
                  className="img-fluid"
                  loading="lazy"
                />
              </div>
              <div className="overlay">
                <h6 className="category-name">{cat.name}</h6>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
});

export default CategorySection;
