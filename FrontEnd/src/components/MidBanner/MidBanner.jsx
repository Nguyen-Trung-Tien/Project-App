import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "./MidBanner.scss";

const MidBanner = () => {
  return (
    <Container fluid className="mid-banner my-4 px-0">
      <Row className="justify-content-center">
        <Col xl={10} lg={11} md={12}>
          <Carousel interval={4000} controls indicators>
            <Carousel.Item>
              <div className="tgdd-banner">
                <img
                  src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fb/09/fb0976cc436542d757c49c8d7a890b6e.png"
                  alt="Banner 1"
                />
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="tgdd-banner">
                <img
                  src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fb/09/fb0976cc436542d757c49c8d7a890b6e.png"
                  alt="Banner 2"
                />
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="tgdd-banner">
                <img
                  src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fb/09/fb0976cc436542d757c49c8d7a890b6e.png"
                  alt="Banner 3"
                />
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default MidBanner;
