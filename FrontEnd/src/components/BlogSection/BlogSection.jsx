import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./BlogSection.scss";

const BlogSection = ({ limit = 3 }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const mock = [
      {
        id: 1,
        title: "Cách chọn size quần áo chuẩn",
        img: "/images/blog1.jpg",
        excerpt: "Hướng dẫn chọn size quần áo phù hợp với từng dáng người.",
      },
      {
        id: 2,
        title: "Bảo quản đồ điện tử đúng cách",
        img: "/images/blog2.jpg",
        excerpt: "Những mẹo đơn giản giúp thiết bị luôn bền bỉ theo thời gian.",
      },
      {
        id: 3,
        title: "Xu hướng thời trang 2025",
        img: "/images/blog3.jpg",
        excerpt: "Khám phá các xu hướng thời trang nổi bật trong năm 2025.",
      },
    ];
    setPosts(mock.slice(0, limit));
  }, [limit]);

  return (
    <Container fluid className="blog-section">
      <Container>
        <div className="section-head">
          <h3>Tin tức & Mẹo hay</h3>
        </div>

        <Row className="g-3">
          {posts.map((p) => (
            <Col md={4} sm={6} xs={12} key={p.id}>
              <Card className="blog-card">
                <div className="image-wrap">
                  <Card.Img src={p.img} alt={p.title} />
                </div>
                <Card.Body>
                  <Card.Title>{p.title}</Card.Title>
                  <Card.Text className="excerpt">{p.excerpt}</Card.Text>
                  <span className="read-more">Xem chi tiết ›</span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default BlogSection;
