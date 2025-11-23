import { useEffect, useState, useCallback, useRef } from "react";
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
  getProductsByCategoryApi,
} from "../../api/productApi";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import {
  createReviewApi,
  deleteReviewApi,
  getReviewsByProductApi,
  updateReviewApi,
} from "../../api/reviewApi";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getImage } from "../../utils/decodeImage";
import "./ProductDetailPage.scss";
import { addCartItem } from "../../redux/cartSlice";
import ChatBot from "../../components/ChatBot/ChatBot";
import ReviewForm from "../../components/ReviewComponent/ReviewForm";
import ReviewList from "../../components/ReviewComponent/ReviewList";
import {
  createReplyApi,
  getRepliesByReviewApi,
} from "../../api/reviewReplyApi";

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

  const limit = 3;
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(1);
  const currentProductId = useRef(Number(id));
  const [suggestedTotalPages, setSuggestedTotalPages] = useState(1);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const suggestedLimit = 7;
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;
  const fetchSuggestedProducts = useCallback(
    async (categoryId, page = 1, append = false) => {
      if (!categoryId) return;
      setLoadingSuggested(true);
      try {
        const res = await getProductsByCategoryApi(
          categoryId,
          page,
          suggestedLimit
        );

        if (res?.errCode === 0 && Array.isArray(res.products)) {
          const filtered = res.products.filter(
            (p) => p.id !== currentProductId.current
          );

          setSuggestedProducts((prev) => {
            if (append) {
              const combined = [...prev, ...filtered];
              return combined.filter(
                (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
              );
            } else {
              return filtered;
            }
          });

          setSuggestedPage(page);
          setSuggestedTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error("Lỗi lấy sản phẩm gợi ý:", err);
      } finally {
        setLoadingSuggested(false);
      }
    },
    [suggestedLimit]
  );

  useEffect(() => {
    currentProductId.current = Number(id);
  }, [id]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductByIdApi(id);
      if (res?.errCode === 0 && res.product) {
        const p = res.product;
        setProduct(p);
        await fetchReviews(p.id);
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
  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id, page);
    }
  }, [page, product?.id]);

  const handleReplySubmit = async (reviewId, content) => {
    if (!content?.trim()) return;
    const res = await createReplyApi({ reviewId, comment: content }, token);
    if (res.errCode === 0) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, ReviewReplies: [...(r.ReviewReplies || []), res.data] }
            : r
        )
      );
    }
  };
  useEffect(() => {
    if (product?.categoryId) {
      setSuggestedProducts([]);
      setSuggestedPage(1);
      setSuggestedTotalPages(1);
      setLoadingSuggested(false);
      fetchSuggestedProducts(product.categoryId, 1, false);
    }
  }, [product?.id, product?.categoryId, fetchSuggestedProducts]);

  const handleUpdateReview = async (reviewId, payload) => {
    try {
      const res = await updateReviewApi(reviewId, payload, token);
      if (res.errCode === 0) {
        toast.success("Cập nhật đánh giá thành công!");
        fetchReviews(product.id, page);
      } else {
        toast.error(res.errMessage || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật đánh giá!");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await deleteReviewApi(reviewId, token);
      if (res.errCode === 0) {
        toast.success("Xóa đánh giá thành công!");
        fetchReviews(product.id, page);
      } else {
        toast.error(res.errMessage || "Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa đánh giá!");
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

  const discountedPrice = Math.round(
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price
  );

  return (
    <div className="product-detail-page py-3 mh-90">
      <Container>
        <ChatBot />
        <div className="text-left">
          <Link
            to={"/"}
            className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
          >
            <ArrowLeftCircle size={16} className="me-1" />
            Quay lại
          </Link>
        </div>

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
                <div>
                  {reviews.length > 0 ? (
                    <div className="d-flex align-items-center mb-3">
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
                <li>
                  <strong>Đã bán:</strong>{" "}
                  <span className="text-primary fw-semibold">
                    {product.sold ?? 0}
                  </span>
                  {(product?.category?.slug?.includes("dien-thoai") ||
                    product?.category?.name
                      ?.toLowerCase()
                      .includes("điện thoại") ||
                    discountedPrice >= 2000000) && (
                    <div className="text-success fw-semibold fs-6 mb-2">
                      🚚 Miễn phí vận chuyển
                    </div>
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
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input === "") {
                      setQuantity("");
                      return;
                    }
                    const val = Number(input);
                    if (isNaN(val)) return;
                    const newQty = Math.max(1, Math.min(val, product.stock));
                    setQuantity(newQty);
                  }}
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
              </div>
            </div>
          </Col>
        </Row>

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
            onReplySubmit={handleReplySubmit}
            user={user}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
          />
        </div>

        {suggestedProducts.length > 0 ? (
          <div className="suggested-products mt-5 pt-4 border-top">
            <h4 className="fw-bold mb-3">Sản phẩm gợi ý</h4>
            <Row className="g-4">
              {suggestedProducts.map((p) => (
                <Col key={p.id} lg={2} md={3} sm={6} xs={12}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>

            <div className="text-center mt-5">
              {suggestedPage < suggestedTotalPages ? (
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill px-4 py-2"
                  onClick={handleLoadMoreSuggested}
                  disabled={loadingSuggested}
                >
                  {loadingSuggested ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tải...
                    </>
                  ) : (
                    "Xem thêm sản phẩm"
                  )}
                </Button>
              ) : (
                <p className="text-muted fst-italic">
                  Đã hiển thị tất cả sản phẩm gợi ý
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center mt-5 pt-4 border-top">
            <p className="text-muted fst-italic">
              Không có sản phẩm gợi ý nào.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetailPage;
