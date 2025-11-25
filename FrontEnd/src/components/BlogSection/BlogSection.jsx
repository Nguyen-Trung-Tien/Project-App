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
        excerpt: "Hướng dẫn chọn size...",
      },
      {
        id: 2,
        title: "Bảo quản đồ điện tử đúng cách",
        img: "/images/blog2.jpg",
        excerpt: "Mẹo giữ pin...",
      },
      {
        id: 3,
        title: "Trend thời trang 2025",
        img: "/images/blog3.jpg",
        excerpt: "Xu hướng mới...",
      },
    ];
    setPosts(mock.slice(0, limit));
  }, [limit]);

  return (
    <Container fluid className="blog-section my-5">
      <div className="section-head">
        <h3>Tin tức & Mẹo</h3>
      </div>

      <Row xs={1} md={3} className="g-3">
        {posts.map((p) => (
          <Col key={p.id}>
            <Card className="blog-card">
              <Card.Img src={p.img} />
              <Card.Body>
                <Card.Title>{p.title}</Card.Title>
                <Card.Text className="excerpt">{p.excerpt}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogSection;
