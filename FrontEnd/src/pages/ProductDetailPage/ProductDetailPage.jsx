import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Spinner,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CartPlus,
  CreditCard,
  Star,
  StarFill,
} from "react-bootstrap-icons";
import { getProductByIdApi } from "../../api/productApi";
import "./ProductDetailPage.scss";
import { createReviewApi, getReviewsByProductApi } from "../../api/reviewApi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        if (res && res.errCode === 0) {
          setProduct(res.product);
        } else {
          console.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (product?.id) fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    const res = await getReviewsByProductApi(product.id);

    if (res?.errCode === 0) setReviews(res.data);
  };

  const handleSubmitReview = async () => {
    const payload = {
      userId: 1,
      productId: product.id,
      rating: newReview.rating,
      comment: newReview.comment,
    };
    const res = await createReviewApi(payload);
    if (res?.errCode === 0) {
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    }
  };
  const handleAddToCart = () => {
    alert(`🛒 Đã thêm ${quantity} sản phẩm "${product?.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    alert(`💳 Mua ngay ${quantity} sản phẩm "${product?.name}"`);
    navigate("/checkout", { state: { product, quantity } });
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-5">
        <h4>Không tìm thấy sản phẩm!</h4>
        <Link to="/" className="btn btn-outline-secondary mt-3">
          <ArrowLeft className="me-2" /> Quay lại
        </Link>
      </div>
    );

  // 🔧 Xử lý ảnh BLOB → base64
  let imageUrl = "/default-product.jpg";
  try {
    if (product.image) {
      if (typeof product.image === "string") imageUrl = product.image;
      else if (product.image.data) {
        const base64String = btoa(
          new Uint8Array(product.image.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        imageUrl = `data:image/jpeg;base64,${base64String}`;
      }
    }
  } catch (e) {
    console.error("Lỗi xử lý ảnh:", e);
  }

  return (
    <div className="product-detail-page py-5">
      <Container>
        <Link to="/" className="btn btn-outline-secondary mb-4 back-btn">
          <ArrowLeft size={18} className="me-2" /> Quay lại
        </Link>

        <Row className="gy-4 align-items-center">
          {/* Hình ảnh */}
          <Col md={6} className="text-center">
            <div className="product-image-wrapper shadow-sm rounded p-4 bg-white">
              <Image
                src={imageUrl}
                alt={product.name}
                fluid
                className="rounded product-image"
              />
            </div>
          </Col>

          {/* Thông tin */}
          <Col md={6}>
            <div className="product-info">
              <h2 className="fw-bold mb-2">{product.name}</h2>
              <p className="text-muted mb-1">{product.brand || "Không rõ"}</p>
              <h3 className="text-danger fw-semibold mb-3">
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </h3>

              <p className="text-secondary mb-4 lh-lg">{product.description}</p>

              <ul className="list-unstyled mb-4">
                <li>
                  <strong>Danh mục:</strong>{" "}
                  {product.category?.name || "Chưa phân loại"}
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
        <div className="reviews-section mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-3">Đánh giá sản phẩm</h4>

          {/* Form thêm đánh giá */}
          <div className="review-form mb-4">
            <h6 className="mb-2">Viết đánh giá của bạn:</h6>
            <div className="d-flex align-items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setNewReview((p) => ({ ...p, rating: star }))}
                  style={{ cursor: "pointer" }}
                >
                  {star <= newReview.rating ? (
                    <StarFill color="gold" />
                  ) : (
                    <Star color="gray" />
                  )}
                </span>
              ))}
            </div>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập bình luận của bạn..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((p) => ({ ...p, comment: e.target.value }))
              }
              className="mb-2"
            />
            <Button variant="primary" onClick={handleSubmitReview}>
              Gửi đánh giá
            </Button>
          </div>

          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="review-item border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center mb-2">
                  {r.user?.avatar ? (
                    <img
                      src={r.user.avatar}
                      alt={r.user.username}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                      style={{ width: 40, height: 40 }}
                    >
                      {r.user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <strong>{r.user?.username}</strong>
                </div>
                <div className="mb-1">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= r.rating ? (
                      <StarFill key={star} color="gold" />
                    ) : (
                      <Star key={star} color="gray" />
                    )
                  )}
                </div>
                <p className="mb-0">{r.comment}</p>
                <small className="text-muted">
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </small>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
