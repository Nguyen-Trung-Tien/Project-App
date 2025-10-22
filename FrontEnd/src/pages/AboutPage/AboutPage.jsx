import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./AboutPage.scss";

const teamMembers = [
  { name: "Nguyễn Văn A", role: "CEO", img: "/images/team1.jpg" },
  { name: "Trần Thị B", role: "CTO", img: "/images/team2.jpg" },
  { name: "Lê Văn C", role: "Designer", img: "/images/team3.jpg" },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <Container>
          <h1>Chào mừng đến với Công ty ABC</h1>
          <p className="lead">
            Chúng tôi mang lại giải pháp công nghệ tối ưu cho doanh nghiệp của
            bạn.
          </p>
        </Container>
      </section>

      {/* About Us */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="/images/about.jpg"
                alt="About us"
                className="img-fluid rounded shadow-sm"
              />
            </Col>
            <Col md={6}>
              <h2>Về chúng tôi</h2>
              <p>
                Công ty ABC được thành lập với mục tiêu cung cấp các giải pháp
                công nghệ chất lượng cao, giúp doanh nghiệp tối ưu hóa hoạt động
                và phát triển bền vững.
              </p>
              <p>
                Chúng tôi tự hào về đội ngũ chuyên gia giàu kinh nghiệm, luôn
                sáng tạo và tận tâm với khách hàng.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Sứ mệnh</Card.Title>
                  <Card.Text>
                    Cung cấp giải pháp công nghệ hiệu quả, hỗ trợ doanh nghiệp
                    nâng cao năng suất và tiết kiệm chi phí.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Tầm nhìn</Card.Title>
                  <Card.Text>
                    Trở thành đối tác công nghệ hàng đầu, mang lại giá trị lâu
                    dài cho khách hàng và cộng đồng.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">Đội ngũ của chúng tôi</h2>
          <Row>
            {teamMembers.map((member, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="team-card h-100 text-center shadow-sm">
                  <Card.Img variant="top" src={member.img} />
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    <Card.Text>{member.role}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-5 text-center">
        <Container>
          <h2>Hãy liên hệ với chúng tôi ngay!</h2>
          <p className="mb-4">Chúng tôi sẵn sàng hỗ trợ bạn 24/7.</p>
          <Button variant="primary" size="lg" href="/contact">
            Liên hệ ngay
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
