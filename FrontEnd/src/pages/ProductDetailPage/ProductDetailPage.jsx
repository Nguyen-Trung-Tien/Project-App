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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getProductByIdApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { createReviewApi, getReviewsByProductApi } from "../../api/reviewApi";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductDetailPage.scss";
import { getImage } from "../../utils/decodeImage";

const ProductDetailPage = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        if (res?.errCode === 0) setProduct(res.product);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.id) {
      fetchReviews();
      fetchSuggestedProducts();
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      const res = await getReviewsByProductApi(product.id);
      if (res?.errCode === 0) setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuggestedProducts = async (page = 1, append = false) => {
    if (!product?.categoryId) return;
    try {
      append ? setLoadingSuggested(true) : setLoadingSuggested(true);
      const res = await getProductsByCategoryApi(
        product.categoryId,
        page,
        suggestedLimit
      );
      if (res?.errCode === 0) {
        const filtered = res.products.filter((p) => p.id !== product.id);
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

  // Nút xem thêm
  const handleLoadMoreSuggested = () => {
    if (suggestedPage >= suggestedTotalPages) return;
    fetchSuggestedProducts(suggestedPage + 1, true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return;
    try {
      const payload = { userId, productId: product.id, ...newReview };
      const res = await createReviewApi(payload);
      if (res?.errCode === 0) {
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
        toast.success("Gửi đánh giá thành công!");
      } else {
        toast.warning("Đăng nhập để đánh giá!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi đánh giá!");
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

  const imageUrl = getImage(product.image);

  return (
    <div className="product-detail-page py-5">
      <Container>
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <ArrowLeft size={18} className="me-2" /> Quay lại
        </Link>

        <Row className="gy-4 align-items-center">
          <Col md={6} className="text-center">
            <div
              className="product-image-wrapper shadow-sm rounded bg-white p-3"
              style={{ display: "inline-block" }}
            >
              <Image
                src={imageUrl}
                alt={product.name}
                fluid
                style={{
                  maxWidth: "400px",
                  maxHeight: "400px",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          </Col>

          <Col md={6}>
            <h2 className="fw-bold mb-2">{product.name}</h2>

            <ul className="list-unstyled mb-3">
              <li>
                <strong>Danh mục:</strong>{" "}
                {product.category?.name || "Chưa phân loại"}
              </li>
              <li>
                <strong>Số lượng sản phẩm:</strong>{" "}
                {product.stock > 0 ? (
                  <span className="text-success">{product.stock} còn hàng</span>
                ) : (
                  <span className="text-danger">Hết hàng</span>
                )}
              </li>
              {product.discount > 0 && (
                <li>
                  <strong>Giảm giá:</strong>{" "}
                  {Number(product.discount).toFixed(2)}%
                </li>
              )}
            </ul>

            <p className="text-secondary mb-4">{product.description}</p>

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

            <div className="d-flex gap-3 mb-4">
              <Button
                variant="danger"
                size="lg"
                className="flex-fill"
                onClick={handleAddToCart}
                disabled={addingCart || product.stock < 1 || !product.isActive}
              >
                {addingCart ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <CartPlus className="me-2" />
                )}{" "}
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="success"
                size="lg"
                className="flex-fill"
                onClick={handleBuyNow}
              >
                <CreditCard className="me-2" /> Mua ngay
              </Button>
            </div>
          </Col>
        </Row>

        <div className="reviews-section mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-3">Đánh giá sản phẩm</h4>
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
              <div className="text-center mt-3">
                <Button
                  onClick={handleLoadMoreSuggested}
                  disabled={loadingSuggested}
                >
                  {loadingSuggested ? (
                    <Spinner animation="border" size="sm" className="me-2" />
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
