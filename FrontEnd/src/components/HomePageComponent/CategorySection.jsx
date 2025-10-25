import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/CategorySection.scss";
import { getAllCategoryApi } from "../../api/categoryApi";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/product-list?category=${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="categories my-4">
      <h2 className="section-title text-center mb-4">Danh mục nổi bật</h2>
      <Row className="g-4 justify-content-center">
        {categories.map((item) => {
          const imageSrc = item.image
            ? `data:image/jpeg;base64,${item.image}`
            : "/images/default-category.jpg";

          return (
            <Col md={4} sm={6} xs={12} key={item.id}>
              <div
                className="category-card position-relative"
                onClick={() => handleCategoryClick(item.id)}
              >
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="img-fluid rounded"
                />
                <div className="overlay d-flex flex-column align-items-center justify-content-center">
                  <h5 className="text-white fw-bold mb-2">{item.name}</h5>
                  <Button variant="light" size="sm">
                    Xem ngay
                  </Button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default CategorySection;
