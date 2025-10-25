import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllCategoryApi } from "../../api/categoryApi";
import "../../styles/CategorySection.scss";

const CategorySection = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    if (onSelectCategory) onSelectCategory(id);
    navigate(`/product-list?category=${id}`);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="categories my-4">
      <h2 className="section-title text-center mb-4">Danh mục nổi bật</h2>
      <Row className="g-4 justify-content-center">
        {categories.map((cat) => (
          <Col key={cat.id} lg={3} md={4} sm={6} xs={12}>
            <div
              className="category-card position-relative"
              onClick={() => handleCategoryClick(cat.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  cat.image
                    ? `data:image/jpeg;base64,${cat.image}`
                    : "/images/default-category.jpg"
                }
                alt={cat.name}
                className="img-fluid rounded"
              />
              <div className="overlay d-flex flex-column align-items-center justify-content-center">
                <h5 className="text-white fw-bold mb-2">{cat.name}</h5>
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
