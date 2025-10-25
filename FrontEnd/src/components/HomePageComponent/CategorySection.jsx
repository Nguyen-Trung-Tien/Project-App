import React from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/CategorySection.scss";

const CategorySection = ({ categories = [], loading, onSelectCategory }) => {
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Container className="categories my-4">
      <h2 className="section-title text-center mb-4">Danh mục nổi bật</h2>
      <Row className="g-3 justify-content-center">
        {categories.map((cat) => (
          <Col key={cat.id} lg={2} md={3} sm={4} xs={6}>
            <div
              className="category-card-square position-relative"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.id);
                navigate(`/product-list?category=${cat.id}`);
              }}
            >
              <img
                src={
                  cat.image
                    ? `data:image/jpeg;base64,${cat.image}`
                    : "/images/default-category.jpg"
                }
                alt={cat.name}
                className="img-fluid w-100"
              />
              <div className="overlay d-flex flex-column align-items-center justify-content-center">
                <h6 className="text-white fw-bold">{cat.name}</h6>
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
