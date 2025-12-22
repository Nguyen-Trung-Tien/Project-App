import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./BlogSection.scss";

const BlogSection = ({ limit = 3 }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const mock = [
      {
        id: 1,
        title: "Cách chọn thiết bị công nghệ phù hợp",
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
        excerpt: "Hướng dẫn chọn laptop, điện thoại phù hợp nhu cầu.",
      },
      {
        id: 2,
        title: "Bảo quản đồ điện tử đúng cách",
        img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop",
        excerpt: "Mẹo giúp thiết bị luôn bền và ổn định.",
      },
      {
        id: 3,
        title: "Xu hướng công nghệ 2026",
        img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop",
        excerpt: "AI, thiết bị thông minh và công nghệ mới.",
      },
    ];

    setPosts(mock.slice(0, limit));
  }, [limit]);

  return (
    <section className="blog-section">
      <Container>
        <div className="section-head text-center mb-4">
          <h3 className="fw-bold">Tin tức & Mẹo công nghệ</h3>
          <p className="text-muted">
            Cập nhật xu hướng – Mẹo hay – Kinh nghiệm chọn thiết bị
          </p>
        </div>

        <Row className="g-4">
          {posts.map((p) => (
            <Col lg={4} md={6} key={p.id}>
              <Card className="blog-card h-100 border-0 shadow-sm">
                <div className="image-wrap">
                  <Card.Img src={p.img} alt={p.title} />
                </div>

                <Card.Body>
                  <Card.Title className="fw-semibold">{p.title}</Card.Title>
                  <Card.Text className="excerpt text-muted">
                    {p.excerpt}
                  </Card.Text>
                  <span className="read-more">Xem chi tiết →</span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BlogSection;
