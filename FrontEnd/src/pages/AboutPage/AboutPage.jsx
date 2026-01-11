import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { People, RocketTakeoff, Eye } from "react-bootstrap-icons";
import "./AboutPage.scss";
import imgPro1 from "../../assets/1759303601055.png";
import imgPro2 from "../../assets/1759303601055.png";
import imgPro3 from "../../assets/1759555519030.png";
import logoImage from "../../assets/Tien-Tech Shop.png";
const teamMembers = [
  { name: "Nguyễn Trung Tiến", role: "CEO", img: imgPro1 },
  { name: "Nguyễn Trung Tiến", role: "CTO", img: imgPro2 },
  { name: "Nguyễn Trung Tiến", role: "Designer", img: imgPro3 },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center justify-content-center">
        <div className="overlay"></div>

        {/* Logo nổi giữa */}
        <div className="logo-wrapper">
          <img src={logoImage} alt="Tien-Tech Logo" className="logo-img" />
        </div>

        <Container className="text-center position-relative z-2 hero-text">
          <p className="lead mb-4 text-white">
            Giải pháp công nghệ thông minh – Đồng hành cùng thành công của bạn.
          </p>
          <Button
            variant="light"
            size="lg"
            href="/product-list"
            className="fw-semibold"
          >
            Khám phá ngay
          </Button>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="About us"
                className="img-fluid rounded-4 shadow-sm"
              />
            </Col>
            <Col md={6}>
              <h2 className="fw-bold text-primary mb-3">Về chúng tôi</h2>
              <p className="text-muted">
                <strong>Tien-Tech</strong> được thành lập với sứ mệnh cung cấp
                các giải pháp công nghệ thông minh, giúp doanh nghiệp tối ưu hóa
                hoạt động và tăng trưởng bền vững.
              </p>
              <p className="text-muted">
                Chúng tôi sở hữu đội ngũ chuyên gia sáng tạo, luôn đổi mới để
                mang lại trải nghiệm công nghệ tốt nhất cho khách hàng.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 h-100 mission-card">
                <Card.Body className="p-4 text-center">
                  <RocketTakeoff size={40} className="text-primary mb-3" />
                  <h4 className="fw-bold mb-2 text-primary">Sứ mệnh</h4>
                  <p className="text-muted">
                    Cung cấp giải pháp công nghệ tối ưu, giúp doanh nghiệp tăng
                    hiệu suất, tiết kiệm chi phí và bứt phá trong kỷ nguyên số.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 h-100 mission-card">
                <Card.Body className="p-4 text-center">
                  <Eye size={40} className="text-info mb-3" />
                  <h4 className="fw-bold mb-2 text-info">Tầm nhìn</h4>
                  <p className="text-muted">
                    Trở thành đối tác công nghệ đáng tin cậy hàng đầu, mang lại
                    giá trị bền vững cho khách hàng và cộng đồng.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <People size={40} className="text-primary mb-2" />
            <h2 className="fw-bold">Đội ngũ của chúng tôi</h2>
            <div className="section-line mx-auto mt-2"></div>
          </div>
          <Row>
            {teamMembers.map((member, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="team-card h-100 text-center border-0">
                  <div className="team-img-wrapper">
                    <Card.Img variant="top" src={member.img} />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold text-primary">
                      {member.name}
                    </Card.Title>
                    <Card.Text className="text-muted">{member.role}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta text-center text-white py-5">
        <div className="overlay"></div>
        <Container className="position-relative z-2">
          <h2 className="fw-bold mb-3">Hãy liên hệ với chúng tôi ngay!</h2>
          <p className="mb-4">
            Đội ngũ <strong>Tien-Tech</strong> luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
          <Button
            variant="light"
            size="lg"
            href="/contact"
            className="fw-semibold"
          >
            Liên hệ ngay
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
