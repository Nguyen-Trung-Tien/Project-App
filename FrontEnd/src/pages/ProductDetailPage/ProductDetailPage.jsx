import { useEffect, useState, useCallback } from "react";
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
  ArrowLeftCircle,
  CartPlus,
  CreditCard,
  Star,
  StarFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getProductByIdApi,
  getRecommendedProductsApi,
} from "../../api/productApi";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { createReviewApi, getReviewsByProductApi } from "../../api/reviewApi";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getImage } from "../../utils/decodeImage";
import "./ProductDetailPage.scss";
import { addCartItem } from "../../redux/cartSlice";
import ChatBot from "../../components/ChatBot/ChatBot";
import ReviewForm from "../../components/ReviewComponent/ReviewForm";
import ReviewList from "../../components/ReviewComponent/ReviewList";
import { getRepliesByReviewApi } from "../../api/reviewReplyApi";
import PricePredictionModal from "../../components/PricePredictionModal/PricePredictionModal";
import { predictPrice } from "../../api/chatApi";

const ProductDetailPage = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const { id } = useParams();
  const token = user?.accessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showFullDesc, setShowFullDesc] = useState(false);
  const limit = 3;

  const [recommended, setRecommended] = useState([]);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(1);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [loadingMoreRecommended, setLoadingMoreRecommended] = useState(false);
  const [predictResult, setPredictResult] = useState(null);
  const [showPredict, setShowPredict] = useState(false);
  const [loadingPredict, setLoadingPredict] = useState(false);

  const limitRecommended = 6;

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductByIdApi(id);
      if (res?.errCode === 0 && res.product) {
        const p = res.product;
        setProduct(p);

        await fetchReviews(p.id); // OK
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

  const fetchReviews = async (productId, page = 1) => {
    try {
      const res = await getReviewsByProductApi(productId, page, limit);
      if (res?.errCode === 0) {
        const reviewsWithReplies = await Promise.all(
          res.data.map(async (r) => {
            const replyRes = await getRepliesByReviewApi(r.id);
            return { ...r, ReviewReplies: replyRes?.data || [] };
          })
        );
        setReviews(reviewsWithReplies);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  };

  const fetchRecommended = async (page = 1, append = false) => {
    if (!product || !product.id) return;

    try {
      if (page === 1) setLoadingRecommended(true);
      else setLoadingMoreRecommended(true);

      const res = await getRecommendedProductsApi(
        product.id,
        page,
        limitRecommended
      );
      if (res?.errCode === 0) {
        if (append) {
          setRecommended((prev) => [...prev, ...res.data]);
        } else {
          setRecommended(res.data);
        }

        setRecommendedTotalPages(res.pagination?.totalPages || 1);
      }
    } finally {
      setLoadingRecommended(false);
      setLoadingMoreRecommended(false);
    }
  };

  const handleLoadMoreRecommended = () => {
    if (recommendedPage < recommendedTotalPages) {
      const nextPage = recommendedPage + 1;
      setRecommendedPage(nextPage);
      fetchRecommended(nextPage, true);
    }
  };

  useEffect(() => {
    if (!product || !product.id) return;

    setRecommended([]);
    setRecommendedPage(1);
    fetchRecommended(1, false);
  }, [product]);

  const handleAddToCart = async () => {
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    try {
      setAddingCart(true);
      const cartsRes = await getAllCarts(token);
      let cart = cartsRes.data.find((c) => c.userId === userId);
      if (!cart) {
        const newCartRes = await createCart(token, userId);
        cart = newCartRes.data;
      }
      const res = await addCart(
        {
          cartId: cart.id,
          productId: product.id,
          quantity,
        },
        token
      );
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
      const res = await createReviewApi(payload, token);
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

  const handlePricePredict = async () => {
    if (!product?.id) return;

    setLoadingPredict(true);
    try {
      const result = await predictPrice(product.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setPredictResult(result);
      setShowPredict(true);
    } catch (err) {
      console.error(err);
      toast.error("Không thể dự đoán giá!");
    } finally {
      setLoadingPredict(false);
    }
  };

  const formatVND = (val) => {
    if (val == null || val === "") return "0 ₫";
    const number = Number(val);
    if (isNaN(number)) return "0 ₫";
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
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
          <ArrowLeftCircle className="me-2" /> Quay lại
        </Link>
      </div>
    );

  const discountedPrice = Math.round(
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price
  );

  const shortDescription =
    product.description && product.description.length > 250
      ? product.description.slice(0, 250) + "..."
      : product.description;

  return (
    <div className="product-detail-page py-3 mh-90">
      <Container>
        <PricePredictionModal
          show={showPredict}
          onHide={() => setShowPredict(false)}
          result={predictResult}
        />
        <ChatBot />

        {/* Back */}
        <div className="text-left mb-3">
          <Link
            to={"/"}
            className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
          >
            <ArrowLeftCircle size={16} className="me-1" />
            Quay lại
          </Link>
        </div>

        <Row className="gy-4 align-items-center">
          {/* Image */}
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

          {/* Info */}
          <Col md={6}>
            <div className="product-info">
              <h2 className="fw-bold mb-2">{product.name}</h2>

              <div className="mb-2">
                <span className="text-muted">Thương hiệu: </span>
                <strong>{product.brand?.name}</strong>
              </div>
              <div className="mb-3">
                <span className="text-muted">Danh mục: </span>
                <strong>{product.category?.name}</strong>
              </div>

              <div className="mb-3">
                <span className="text-muted">SKU: </span>
                <strong>{product.sku}</strong> |
                <span className="text-muted ms-2">Đã bán: </span>
                <strong>{product.sold}</strong> |
                <span className="text-muted ms-2">Còn hàng: </span>
                <strong>{product.stock}</strong>
              </div>

              {/* Price */}
              <div className="price mb-3">
                <div>
                  {product.discount > 0 && (
                    <>
                      {/* Giá gốc gạch ngang */}
                      <div className="text-muted text-decoration-line-through">
                        {formatVND(product.price)}
                      </div>

                      {/* Giảm giá trực tiếp */}
                      <div className="text-success fw-semibold">
                        Giảm giá: {parseFloat(product.discount).toFixed(2)}%
                      </div>
                    </>
                  )}

                  {/* Giá sau giảm */}
                  <div className="fw-bold text-danger fs-5">
                    {formatVND(discountedPrice)}
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="d-flex align-items-center mt-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.floor(avgRating) ? (
                          <StarFill color="gold" />
                        ) : avgRating >= star - 0.5 ? (
                          <Star color="gold" />
                        ) : (
                          <Star color="lightgray" />
                        )}
                      </span>
                    ))}
                    <span className="ms-2 text-muted small">
                      {avgRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
                    </span>
                  </div>
                ) : (
                  <p className="text-muted small mb-3">Chưa có đánh giá</p>
                )}
              </div>

              {/* Specs */}
              {(product.color ||
                product.ram ||
                product.rom ||
                product.screen ||
                product.cpu ||
                product.battery ||
                product.weight ||
                product.connectivity ||
                product.os ||
                product.extra) && (
                <div className="product-specs mb-3">
                  {product.color && (
                    <div>
                      <strong>Màu sắc:</strong> {product.color}
                    </div>
                  )}
                  {product.ram && (
                    <div>
                      <strong>RAM:</strong> {product.ram}
                    </div>
                  )}
                  {product.rom && (
                    <div>
                      <strong>ROM:</strong> {product.rom}
                    </div>
                  )}
                  {product.screen && (
                    <div>
                      <strong>Màn hình:</strong> {product.screen}
                    </div>
                  )}
                  {product.cpu && (
                    <div>
                      <strong>CPU:</strong> {product.cpu}
                    </div>
                  )}
                  {product.battery && (
                    <div>
                      <strong>Pin:</strong> {product.battery}
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <strong>Trọng lượng:</strong> {product.weight}
                    </div>
                  )}
                  {product.connectivity && (
                    <div>
                      <strong>Kết nối:</strong> {product.connectivity}
                    </div>
                  )}
                  {product.os && (
                    <div>
                      <strong>OS:</strong> {product.os}
                    </div>
                  )}
                  {product.extra && (
                    <div>
                      <strong>Thông tin thêm:</strong> {product.extra}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="product-description mb-4">
                <p className="text-secondary" style={{ lineHeight: "1.6" }}>
                  {showFullDesc ? product.description : shortDescription}
                </p>
                {product.description?.length > 250 && (
                  <button
                    className="btn btn-link p-0 mt-2 fw-semibold"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                  >
                    {showFullDesc ? "Thu gọn ▲" : "Xem thêm ▼"}
                  </button>
                )}
              </div>

              {/* Quantity */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <Form.Label className="fw-semibold mb-0">Số lượng:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input === "") {
                      setQuantity("");
                      return;
                    }
                    const val = Number(input);
                    if (isNaN(val)) return;
                    setQuantity(Math.max(1, Math.min(val, product.stock)));
                  }}
                  style={{ width: "90px" }}
                />
              </div>

              {/* Buttons */}
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
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                        variant="primary"
                      />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <CartPlus className="me-2" size={22} /> Thêm vào giỏ hàng
                    </>
                  )}
                </Button>

                {product.stock > 0 && (
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-fill d-flex align-items-center justify-content-center"
                    onClick={handleBuyNow}
                  >
                    <CreditCard className="me-2" size={22} /> Mua ngay
                  </Button>
                )}

                <Button
                  variant="warning"
                  size="lg"
                  className="flex-fill d-flex align-items-center justify-content-center"
                  onClick={handlePricePredict}
                  disabled={loadingPredict}
                >
                  {loadingPredict ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      Đang dự đoán...
                    </>
                  ) : (
                    <>🔮 Dự đoán giá tương lai</>
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Reviews */}
        <div className="reviews-section mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-3">Đánh giá sản phẩm</h4>
          <ReviewForm
            newReview={newReview}
            setNewReview={setNewReview}
            onSubmit={handleSubmitReview}
          />
          <ReviewList
            reviews={reviews}
            page={page}
            pagination={pagination}
            onPageChange={(newPage) => {
              setPage(newPage);
              fetchReviews(product.id, newPage);
            }}
            user={user}
          />
        </div>

        {/* Recommended */}
        <div className="recommended-products mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-3">Sản phẩm gợi ý</h4>

          {loadingRecommended ? (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : recommended.length > 0 ? (
            <>
              <Row className="g-4">
                {recommended.map((p) => (
                  <Col key={p.id} lg={2} md={3} sm={6} xs={12}>
                    <ProductCard product={p} />
                  </Col>
                ))}
              </Row>

              {/* Nút Load More */}
              {loadingMoreRecommended && (
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              {recommendedPage < recommendedTotalPages &&
                !loadingMoreRecommended && (
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-primary"
                      className="rounded-pill px-3 py-2 shadow-sm"
                      onClick={handleLoadMoreRecommended}
                    >
                      Xem thêm sản phẩm
                    </Button>
                  </div>
                )}
            </>
          ) : (
            <p className="text-muted fst-italic">
              Không có sản phẩm gợi ý nào.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
