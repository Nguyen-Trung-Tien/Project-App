import React, { useEffect, useState, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getProductByIdApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { createReviewApi, getReviewsByProductApi } from "../../api/reviewApi";

import ProductCard from "../../components/ProductCard/ProductCard";
import { getImage } from "../../utils/decodeImage";
import "./ProductDetailPage.scss";
import { addCartItem } from "../../redux/cartSlice";

const StarRating = ({ rating, onChange, interactive = false }) => (
  <div className="d-flex align-items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => interactive && onChange?.(star)}
        style={{ cursor: interactive ? "pointer" : "default" }}
      >
        {star <= rating ? <StarFill color="gold" /> : <Star color="gray" />}
      </span>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [suggestedTotalPages, setSuggestedTotalPages] = useState(1);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const suggestedLimit = 4;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductByIdApi(id);
      if (res?.errCode === 0 && res.product) {
        const p = res.product;
        setProduct(p);
        fetchReviews(p.id);
        fetchSuggestedProducts(p.categoryId);
      } else {
        toast.error("Không tìm thấy sản phẩm!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchReviews = async (productId) => {
    try {
      const res = await getReviewsByProductApi(productId);
      if (res?.errCode === 0) setReviews(res.data);
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  };

  const fetchSuggestedProducts = async (
    categoryId,
    page = 1,
    append = false
  ) => {
    if (!categoryId) return;
    setLoadingSuggested(true);
    try {
      const res = await getProductsByCategoryApi(
        categoryId,
        page,
        suggestedLimit
      );
      if (res?.errCode === 0) {
        const filtered = res.products.filter((p) => p.id !== Number(id));
        setSuggestedProducts((prev) =>
          append ? [...prev, ...filtered] : filtered
        );
        setSuggestedPage(res.currentPage || page);
        setSuggestedTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm gợi ý:", err);
    } finally {
      setLoadingSuggested(false);
    }
  };

  const handleLoadMoreSuggested = () => {
    if (suggestedPage < suggestedTotalPages) {
      fetchSuggestedProducts(product.categoryId, suggestedPage + 1, true);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    try {
      setAddingCart(true);
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }
      const res = await addCart({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });
      if (res.errCode === 0) {
        dispatch(addCartItem({ ...product, quantity }));

        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      } else {
        toast.error(res.errMessage || "Thêm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product?.id) return;
    navigate("/checkout", { state: { product, quantity } });
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      toast.warning("Đăng nhập để gửi đánh giá!");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.info("Vui lòng nhập bình luận!");
      return;
    }
    try {
      const payload = { userId, productId: product.id, ...newReview };
      const res = await createReviewApi(payload);
      if (res?.errCode === 0) {
        toast.success("Gửi đánh giá thành công!");
        setNewReview({ rating: 5, comment: "" });
        fetchReviews(product.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi đánh giá!");
    }
  };

  const formatVND = (val) =>
    val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
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

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return (
    <div className="product-detail-page py-5">
      <Container>
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <ArrowLeft size={18} className="me-2" /> Quay lại
        </Link>

        <Row className="gy-4 align-items-center">
          <Col md={6} className="text-center">
            <div className="product-image-wrapper shadow-sm rounded bg-white p-3 position-relative">
              <Image
                src={getImage(product.image)}
                alt={product.name}
                fluid
                className="product-image"
              />
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>
          </Col>

          <Col md={6}>
            <div className="product-info">
              <h2 className="fw-bold mb-3">{product.name}</h2>

              <div className="price mb-3">
                {product.discount > 0 && (
                  <div className="text-muted text-decoration-line-through">
                    {formatVND(product.price)}
                  </div>
                )}
                <div className="fw-bold text-danger fs-5">
                  {formatVND(discountedPrice)}
                </div>
              </div>

              <ul className="list-unstyled mb-3 small">
                <li>
                  <strong>Danh mục:</strong>{" "}
                  {product.category?.name || "Chưa phân loại"}
                </li>
                <li>
                  <strong>Tồn kho:</strong>{" "}
                  {product.stock > 0 ? (
                    <span className="text-success">{product.stock}</span>
                  ) : (
                    <span className="text-danger">Hết hàng</span>
                  )}
                </li>
              </ul>

              <p className="text-secondary mb-4" style={{ lineHeight: "1.6" }}>
                {product.description || "Chưa có mô tả sản phẩm."}
              </p>

              <div className="d-flex align-items-center gap-3 mb-4">
                <Form.Label className="fw-semibold mb-0">Số lượng:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(Number(e.target.value), product.stock)
                      )
                    )
                  }
                  style={{ width: "90px" }}
                />
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  className="flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleAddToCart}
                  disabled={
                    addingCart || product.stock < 1 || !product.isActive
                  }
                >
                  {addingCart ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <CartPlus className="me-2" /> Thêm vào giỏ hàng
                    </>
                  )}
                </Button>

                <Button
                  variant="success"
                  size="lg"
                  className="flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="me-2" /> Mua ngay
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <div className="reviews-section mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-3">Đánh giá sản phẩm</h4>

          <div className="review-form mb-4">
            <h6 className="mb-2">Viết đánh giá của bạn:</h6>
            <StarRating
              rating={newReview.rating}
              onChange={(star) => setNewReview((p) => ({ ...p, rating: star }))}
              interactive
            />
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập bình luận của bạn..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((p) => ({ ...p, comment: e.target.value }))
              }
              className="my-2"
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
                      src={getImage(r.user.avatar)}
                      alt={r.user.username}
                      className="rounded-circle me-2"
                      width={40}
                      height={40}
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
                <StarRating rating={r.rating} />
                <p className="mb-0">
                  {r.comment.length > 200
                    ? r.comment.slice(0, 200) + "..."
                    : r.comment}
                </p>
                <small className="text-muted">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </small>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>

        {suggestedProducts.length > 0 && (
          <div className="suggested-products mt-5 pt-4 border-top">
            <h4 className="fw-bold mb-3">Sản phẩm gợi ý</h4>
            <Row className="g-4">
              {suggestedProducts.map((p) => (
                <Col key={p.id} md={3} sm={6} xs={12}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>

            {suggestedPage < suggestedTotalPages && (
              <div className="text-center mt-4">
                <Button
                  size="lg"
                  variant="outline-primary"
                  onClick={handleLoadMoreSuggested}
                  disabled={loadingSuggested}
                >
                  {loadingSuggested ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tải...
                    </>
                  ) : (
                    "Xem thêm"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetailPage;
