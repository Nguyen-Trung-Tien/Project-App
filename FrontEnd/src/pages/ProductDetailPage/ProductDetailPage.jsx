import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Card,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftCircle, CartPlus } from "react-bootstrap-icons";
import "./ProductDetailPage.scss";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu mẫu (sẽ thay bằng API thực tế)
  const product = {
    id,
    name: "iPhone 15 Pro Max",
    price: 36990000,
    image: "/images/product-1.jpg",
    description:
      "iPhone 15 Pro Max là siêu phẩm mới nhất của Apple với chip A17 Pro, thiết kế titanium cao cấp và camera 48MP cải tiến.",
    category: "Điện thoại",
    brand: "Apple",
    stock: 12,
  };

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="product-detail-page">
      <Container>
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <ArrowLeftCircle size={18} className="me-1" /> Quay lại
        </Link>

        <Row className="align-items-center">
          {/* Hình ảnh sản phẩm */}
          <Col md={5} className="text-center">
            <Card className="shadow-sm border-0 p-3">
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="rounded product-image"
              />
            </Card>
          </Col>

          {/* Thông tin sản phẩm */}
          <Col md={7}>
            <div className="product-info">
              <h2 className="fw-bold">{product.name}</h2>
              <p className="text-muted">{product.brand}</p>
              <h3 className="text-primary mb-3">
                {product.price.toLocaleString()}₫
              </h3>
              <p className="text-secondary mb-4">{product.description}</p>

              <div className="mb-3">
                <strong>Danh mục:</strong> {product.category}
              </div>
              <div className="mb-3">
                <strong>Tình trạng:</strong>{" "}
                {product.stock > 0 ? (
                  <span className="text-success">Còn hàng</span>
                ) : (
                  <span className="text-danger">Hết hàng</span>
                )}
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <Form.Label className="fw-semibold mb-0">Số lượng:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: "100px" }}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-4"
                onClick={handleAddToCart}
              >
                <CartPlus size={20} className="me-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
