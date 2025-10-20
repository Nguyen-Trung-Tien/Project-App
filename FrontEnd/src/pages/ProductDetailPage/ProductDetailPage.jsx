import React, { useState } from "react";
import { Container, Row, Col, Button, Image, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CartPlus, CreditCard } from "react-bootstrap-icons";
import "./ProductDetailPage.scss";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // ✅ Dữ liệu mẫu (tạm thời)
  const product = {
    id,
    name: "iPhone 15 Pro Max 256GB",
    price: 36990000,
    image: "/images/product-1.jpg",
    description:
      "iPhone 15 Pro Max là siêu phẩm mới nhất của Apple với chip A17 Pro, khung titanium siêu nhẹ và cụm camera 48MP mạnh mẽ, mang lại hiệu năng vượt trội và trải nghiệm đẳng cấp.",
    category: "Điện thoại",
    brand: "Apple",
    stock: 12,
  };

  const handleAddToCart = () => {
    alert(`🛒 Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // ⚡ Khi có backend, bạn sẽ tạo order tạm và chuyển sang trang /checkout
    alert(`💳 Mua ngay ${quantity} sản phẩm "${product.name}"`);
    navigate("/checkout", { state: { product, quantity } });
  };

  return (
    <div className="product-detail-page py-5">
      <Container>
        <Link to="/" className="btn btn-outline-secondary mb-4 back-btn">
          <ArrowLeft size={18} className="me-2" /> Quay lại
        </Link>

        <Row className="gy-4 align-items-center">
          {/* Hình ảnh sản phẩm */}
          <Col md={6} className="text-center">
            <div className="product-image-wrapper shadow-sm rounded p-4 bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="rounded product-image"
              />
            </div>
          </Col>

          {/* Thông tin sản phẩm */}
          <Col md={6}>
            <div className="product-info">
              <h2 className="fw-bold mb-2">{product.name}</h2>
              <p className="text-muted mb-1">{product.brand}</p>
              <h3 className="text-danger fw-semibold mb-3">
                {product.price.toLocaleString("vi-VN")} ₫
              </h3>

              <p className="text-secondary mb-4 lh-lg">{product.description}</p>

              <ul className="list-unstyled mb-4">
                <li>
                  <strong>Danh mục:</strong> {product.category}
                </li>
                <li>
                  <strong>Tình trạng:</strong>{" "}
                  {product.stock > 0 ? (
                    <span className="text-success">Còn hàng</span>
                  ) : (
                    <span className="text-danger">Hết hàng</span>
                  )}
                </li>
              </ul>

              <div className="d-flex align-items-center gap-3 mb-4">
                <Form.Label className="fw-semibold mb-0">Số lượng:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: "90px" }}
                />
              </div>

              {/* 🔘 Nút hành động */}
              <div className="d-flex gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  className="rounded-pill px-4 fw-semibold shadow-sm flex-fill"
                  onClick={handleAddToCart}
                >
                  <CartPlus size={20} className="me-2" />
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  variant="success"
                  size="lg"
                  className="rounded-pill px-4 fw-semibold shadow-sm flex-fill"
                  onClick={handleBuyNow}
                >
                  <CreditCard size={20} className="me-2" />
                  Mua ngay
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
