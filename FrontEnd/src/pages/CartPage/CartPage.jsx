import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Spinner,
  Card,
} from "react-bootstrap";
import {
  Trash,
  ArrowLeftCircle,
  Cart4,
  Box2Heart,
} from "react-bootstrap-icons";
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
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const observer = useRef();

  // Fetch cart items
  const fetchCart = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllCartItems(token, page, 10);
      const items = res.data || [];

      if (page === 1) {
        dispatch(setCartItems(items));
      } else {
        dispatch(appendCartItems(items));
      }

      setHasMore(page < res.meta.totalPages);
      if (page === 1) setSelectedItems([]);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load first page
  useEffect(() => {
    fetchCart(1);
  }, []);

  // Infinite scroll observer
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch next page when page state changes
  useEffect(() => {
    if (page === 1) return;
    fetchCart(page);
  }, [page]);

  // Remove cart item
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

  // Select item
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
        <div className="text-center mb-2">
          <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill cart-title">
            <Cart4 size={26} className="me-2" />
            <h3 className="fw-bold mb-0">Giỏ hàng</h3>
          </div>
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
            <Col lg={8}>
              <Card className="shadow-lg border-0 rounded-4">
                <Card.Body>
                  <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-primary text-white rounded-top">
                      <tr>
                        <th style={{ width: "50px" }}>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.length === cartItems.length}
                            onChange={() =>
                              setSelectedItems(
                                selectedItems.length === cartItems.length
                                  ? []
                                  : cartItems.map((item) => item.id)
                              )
                            }
                          />
                        </th>
                        <th>Hình ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => {
                        const price = item.product?.discount
                          ? (item.product.price *
                              (100 - item.product.discount)) /
                            100
                          : item.product?.price || 0;
                        const isLast = index === cartItems.length - 1;

                        return (
                          <tr key={item.id} ref={isLast ? lastItemRef : null}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                              />
                            </td>
                            <td style={{ width: "100px" }}>
                              <Link to={`/product-detail/${item.product?.id}`}>
                                <div className="position-relative">
                                  {item.product?.discount > 0 && (
                                    <span className="discount-badge">
                                      -{item.product.discount}%
                                    </span>
                                  )}

                                  <img
                                    src={getImage(item.product?.image)}
                                    alt={item.product?.name}
                                    className="img-fluid rounded-3 product-image"
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              </Link>
                            </td>

                            <td className="text-start fw-semibold">
                              <Link
                                to={`/product-detail/${item.product?.id}`}
                                className="product-name-link"
                              >
                                {item.product?.name}
                              </Link>
                            </td>
                            <td className="text-end">
                              {item.product?.discount > 0 ? (
                                <>
                                  <div className="text-muted text-decoration-line-through small">
                                    {(item.product.price || 0).toLocaleString()}
                                    ₫
                                  </div>
                                  <div className="text-danger fw-bold">
                                    {price.toLocaleString()}₫
                                  </div>
                                </>
                              ) : (
                                <span>{price.toLocaleString()}₫</span>
                              )}
                            </td>
                            <td style={{ width: "90px" }}>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.quantity || 1}
                                className="text-center rounded-pill border-primary"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1)
                                    handleQtyChange(item.id, value);
                                }}
                              />
                            </td>
                            <td className="fw-bold text-end text-success">
                              {(price * (item.quantity || 0)).toLocaleString()}₫
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle border-0"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash size={18} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  {loading && page > 1 && (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" variant="primary" />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-lg border-0 rounded-4 p-2">
                <Card.Body>
                  <h5 className="fw-bold mb-4 text-center text-primary">
                    Tóm tắt đơn hàng
                  </h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{total.toLocaleString()}₫</span>
                  </div>
                  <div className="d-flex justify-content-between fw-semibold mb-2">
                    <span>Phí vận chuyển:</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Tổng cộng:</h5>
                    <h5 className="text-primary mb-0 fw-bold">
                      {total.toLocaleString()}₫
                    </h5>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100 mt-4 rounded-pill fw-semibold shadow-sm py-2"
                    onClick={handleCheckOut}
                  >
                    Tiến hành thanh toán
                  </Button>
                  <Link
                    to="/"
                    className="btn btn-outline-primary w-100 mt-3 rounded-pill"
                  >
                    <ArrowLeftCircle size={18} className="me-1" />
                    Tiếp tục mua sắm
                  </Link>
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
