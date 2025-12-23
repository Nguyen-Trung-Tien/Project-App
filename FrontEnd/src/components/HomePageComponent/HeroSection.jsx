import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "react-bootstrap-icons";
import "../../styles/HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-ttshop">
      <div className="container">
        <div className="row align-items-center">
          {/* ===== LEFT CONTENT ===== */}
          <div className="col-lg-6 text-white text-center text-lg-start">
            <span className="hero-badge mb-3 d-inline-block">
              🔥 Ưu đãi công nghệ mỗi ngày
            </span>

            <h1 className="hero-title mb-4">
              TienTech Shop <br />
              <span>Công nghệ chính hãng</span>
            </h1>

            <p className="hero-desc mb-5">
              Laptop – Điện thoại – PC – Phụ kiện <br />
              Giá tốt • Bảo hành chính hãng • Giao hàng nhanh
            </p>

            <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
              <Button
                className="hero-btn-primary px-4 py-2"
                onClick={() => navigate("/product-list  ")}
              >
                Mua ngay <ArrowRight className="ms-2" />
              </Button>

              <Button
                variant="outline-light"
                className="px-4 py-2"
                onClick={() => navigate("/about")}
              >
                Giới thiệu về TienTech
              </Button>
            </div>
          </div>

          {/* ===== RIGHT IMAGE ===== */}
          <div className="col-lg-6 d-none d-lg-block text-center">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
              alt="TienTech Shop"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
