import React from "react";
import { Container, Button } from "react-bootstrap";
import "../../styles/AboutSection.scss";

const AboutSection = () => {
  return (
    <section className="about-section text-center text-light">
      <div className="overlay">
        <Container>
          <h2>Vì sao chọn E-Store?</h2>
          <p>
            E-Store mang đến trải nghiệm mua sắm trực tuyến hiện đại, an toàn và
            nhanh chóng. Với đội ngũ hỗ trợ tận tâm và chính sách bảo hành minh
            bạch, bạn hoàn toàn yên tâm khi mua sắm cùng chúng tôi.
          </p>
          <Button variant="light">Tìm hiểu thêm</Button>
        </Container>
      </div>
    </section>
  );
};

export default AboutSection;
