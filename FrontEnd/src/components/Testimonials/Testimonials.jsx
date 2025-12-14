import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Testimonials.scss";
import image1 from "../../assets/000000005b6461.png";

const Testimonials = ({ limit = 3 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const mock = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        text: "Sản phẩm tốt, giao hàng rất nhanh.",
        avatar: image1,
      },
      {
        id: 2,
        name: "Trần Thị B",
        text: "Nhân viên tư vấn nhiệt tình, dễ thương.",
        avatar: image1,
      },
      {
        id: 3,
        name: "Lê Văn C",
        text: "Chất lượng đúng như mô tả, sẽ ủng hộ tiếp.",
        avatar: image1,
      },
    ];
    setItems(mock.slice(0, limit));
  }, [limit]);

  return (
    <Container fluid className="testimonials">
      <Container>
        <div className="section-head">
          <h3>✨Khách hàng nói gì về chúng tôi✨</h3>
        </div>

        <Row className="g-3">
          {items.map((t) => (
            <Col md={4} sm={6} xs={12} key={t.id}>
              <Card className="test-card">
                <Card.Body>
                  <div className="user-info">
                    <img src={t.avatar} alt={t.name} />
                    <div>
                      <h6>{t.name}</h6>
                      <div className="stars">★★★★★</div>
                    </div>
                  </div>
                  <p className="content">“{t.text}”</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Testimonials;
