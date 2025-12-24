import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Card,
} from "react-bootstrap";
import { Trash, ArrowLeftCircle, Box2Heart } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartItems,
  appendCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "../../redux/cartSlice";
import { toast } from "react-toastify";
import {
  getAllCartItems,
  removeCartItem as removeCartItemApi,
  updateCartItem as updateCartItemApi,
} from "../../api/cartApi";
import { getImage } from "../../utils/decodeImage";
import "./CartPage.scss";
import { setSelectedIds } from "../../redux/checkoutSlice";

const CartPage = () => {
  const token = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const observer = useRef();

  const fetchCart = async (page = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAllCartItems(token, page, 10);
      const items = Array.isArray(res?.data) ? res.data : [];

      if (items.length > 0) {
        if (page === 1) dispatch(setCartItems(items));
        else dispatch(appendCartItems(items));
      }

      setHasMore(items.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    if (cartItems.length === 0) {
      fetchCart(1);
    }
  }, [token, cartItems.length]);

  useEffect(() => {
    if (page === 1) return;
    fetchCart(page);
  }, [page]);

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );

  // Remove item
  const handleRemove = async (id) => {
    try {
      await removeCartItemApi(id, token);
      dispatch(removeCartItem(id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  // Update quantity
  const handleQtyChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(id, quantity, token);
      dispatch(updateCartItemQuantity({ id, quantity }));
    } catch {
      toast.error("Cập nhật số lượng thất bại!");
    }
  };

  // Select/unselect item
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Checkout
  const handleCheckOut = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }
    dispatch(setSelectedIds(selectedItems));
    navigate("/checkout");
  };

  // Calculate total
  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => {
      const price = item.product?.discount
        ? (item.product.price * (100 - item.product.discount)) / 100
        : item.product?.price || 0;
      return acc + price * (item.quantity || 0);
    }, 0);

  return (
    <div className="cart-page py-3">
      <Container>
        <div className="cart-header mb-3">
          <h4 className="fw-bold mb-1">🛒 Giỏ hàng</h4>
          <span className="text-muted small">{cartItems.length} sản phẩm</span>
        </div>

        {/* Select all */}
        <div className="d-flex align-items-center mb-3">
          <Form.Check
            className="me-2"
            checked={
              cartItems.length > 0 && selectedItems.length === cartItems.length
            }
            onChange={() =>
              setSelectedItems(
                selectedItems.length === cartItems.length
                  ? []
                  : cartItems.map((item) => item.id)
              )
            }
          />
          <span className="fw-semibold">
            Chọn tất cả ({cartItems.length} sản phẩm)
          </span>
        </div>

        {loading && page === 1 ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải giỏ hàng...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart text-center py-5">
            <Box2Heart
              size={80}
              className="text-primary mb-2"
              style={{ opacity: 0.85 }}
            />
            <h5 className="fw-bold mt-2">Giỏ hàng của bạn đang trống</h5>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Hãy khám phá sản phẩm và thêm vào giỏ ngay!
            </p>
            <Link
              to="/"
              className="btn btn-primary mt-3 rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              <ArrowLeftCircle size={18} className="me-1" />
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {/* Left: Cart List */}
            <Col lg={8}>
              <Card className="cart-list shadow-sm border-0">
                <Card.Body>
                  <h6 className="fw-bold mb-3">
                    Giỏ hàng của bạn ({cartItems.length} sản phẩm)
                  </h6>

                  {cartItems.map((item, index) => {
                    const price = item.product?.discount
                      ? (item.product.price * (100 - item.product.discount)) /
                        100
                      : item.product?.price || 0;

                    const isLast = index === cartItems.length - 1;

                    return (
                      <div
                        key={item.id}
                        ref={isLast ? lastItemRef : null}
                        className="cart-item d-flex gap-3"
                      >
                        <Form.Check
                          className="mt-1"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                        <img
                          src={getImage(item.product?.image)}
                          alt={item.product?.name}
                          className="cart-item-img"
                        />
                        <div className="flex-grow-1">
                          <span className="badge bg-primary mb-1">
                            {item.product?.category?.name || "Sản phẩm"}
                          </span>
                          <h6 className="mb-1">{item.product?.name}</h6>

                          {/* Hiển thị giá và discount */}
                          {item.product?.discount ? (
                            <div className="text-primary fw-bold">
                              <span>{price.toLocaleString()} ₫</span>
                              <span className="text-muted ms-2 text-decoration-line-through">
                                {item.product.price.toLocaleString()} ₫
                              </span>
                              <span className="badge bg-danger ms-2">
                                -{item.product.discount}%
                              </span>
                            </div>
                          ) : (
                            <div className="text-primary fw-bold">
                              {price.toLocaleString()} ₫
                            </div>
                          )}

                          <div className="quantity-box mt-2">
                            <button
                              onClick={() =>
                                handleQtyChange(item.id, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQtyChange(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <Button
                            variant="link"
                            className="text-danger p-0 hover"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash size={18} />
                          </Button>

                          <div className="fw-bold text-primary mt-4">
                            {(price * item.quantity).toLocaleString()} ₫
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {loading && page > 1 && (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </Card.Body>
                {loading && page > 1 && (
                  <div className="text-center py-2">
                    <Spinner animation="border" size="sm" variant="primary" />
                  </div>
                )}

                {!hasMore && cartItems.length > 0 && (
                  <div
                    className="text-center py-2 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    🎉 Đã hiển thị tất cả sản phẩm
                  </div>
                )}
              </Card>
            </Col>

            {/* Right: Checkout */}
            <Col lg={4}>
              <Card className="checkout-box shadow-sm border-0">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Tổng đơn hàng</h6>

                  <div className="discount-box mb-3">
                    <Form.Control placeholder="Mã giảm giá" />
                    <Button variant="outline-primary">Áp dụng</Button>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{total.toLocaleString()} ₫</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span className="text-success">Miễn phí</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {total.toLocaleString()} ₫
                    </span>
                  </div>

                  <small className="text-muted d-block mb-2">
                    Đã chọn {selectedItems.length} sản phẩm
                  </small>

                  <Button className="w-100 mb-2" onClick={handleCheckOut}>
                    Thanh toán
                  </Button>

                  <Link to="/" className="btn btn-outline-secondary w-100">
                    Tiếp tục mua hàng
                  </Link>

                  <div className="support-box mt-3">
                    <p className="fw-bold mb-1">Cần hỗ trợ?</p>
                    <small>Liên hệ hotline để được tư vấn miễn phí</small>
                    <div className="fw-bold mt-1">📞 1900 9999</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
