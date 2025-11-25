import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Testimonials.scss";

const Testimonials = ({ limit = 3 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const mock = [
      {
        id: 1,
        name: "Nguyễn A",
        text: "Sản phẩm tốt, giao nhanh!",
        avatar: "/images/avatar1.png",
      },
      {
        id: 2,
        name: "Trần B",
        text: "Dịch vụ support rất nhiệt tình",
        avatar: "/images/avatar2.png",
      },
      {
        id: 3,
        name: "Lê C",
        text: "Chất lượng vượt mong đợi",
        avatar: "/images/avatar3.png",
      },
    ];
    setItems(mock.slice(0, limit));
  }, [limit]);

  return (
    <Container fluid className="testimonials my-5">
      <div className="section-head">
        <h3>Khách hàng nói gì</h3>
      </div>

      <Row className="g-3">
        {items.map((t) => (
          <Col md={4} key={t.id}>
            <Card className="test-card">
              <Card.Body>
                <div className="top d-flex align-items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="avatar" />
                  <div>
                    <h6>{t.name}</h6>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
                <p className="mt-3">{t.text}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
