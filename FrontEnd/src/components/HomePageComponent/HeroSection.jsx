import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "react-bootstrap-icons";
import "../../styles/HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section position-relative d-flex align-items-center justify-content-center text-center">
      <div className="hero-content container position-relative text-white">
        <h1 className="hero-title fw-bold mb-2">
          <span style={{ color: "#007bff" }}>T</span>ien-
          <span style={{ color: "#007bff" }}>T</span>ech
        </h1>

        <p className="hero-subtitle mb-4">
          <strong>Mua sắm công nghệ thông minh</strong> – Chất lượng vượt trội –
          Ưu đãi ngập tràn
        </p>

        <Button
          variant="light"
          className="hero-btn fw-semibold px-4 py-2 rounded-pill shadow"
          onClick={() => navigate("/product-list")}
        >
          Khám phá ngay <ArrowRight className="ms-2" size={18} />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
