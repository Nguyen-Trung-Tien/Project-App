import React, { useEffect, useState } from "react";
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
import { Trash, ArrowLeftCircle, Cart4 } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartItems,
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

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getAllCartItems();
      const items = res.data || [];
      dispatch(setCartItems(items));
      setSelectedItems(items.map((item) => item.id));
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeCartItemApi(id);
      dispatch(removeCartItem(id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  const handleQtyChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(id, quantity);
      dispatch(updateCartItemQuantity({ id, quantity }));
    } catch {
      toast.error("Cập nhật số lượng thất bại!");
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => {
      const price = item.product?.discount
        ? (item.product.price * (100 - item.product.discount)) / 100
        : item.product?.price || 0;
      return acc + price * (item.quantity || 0);
    }, 0);

  const handleCheckOut = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }
    navigate("/checkout", { state: { selectedIds: selectedItems } });
  };

  return (
    <div className="cart-page py-5">
      <Container>
        {/* Tiêu đề */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill cart-title">
            <Cart4 size={26} className="me-2" />
            <h2 className="fw-bold mb-0">Giỏ hàng của bạn</h2>
          </div>
          <div className="title-underline mx-auto mt-2"></div>
        </div>

        {/* Nội dung */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải giỏ hàng...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="/empty-cart.svg"
              alt="empty cart"
              className="img-fluid mb-3"
              style={{ maxWidth: "250px" }}
            />
            <p className="text-muted">Giỏ hàng trống. Hãy mua sắm ngay!</p>
            <Link to="/" className="btn btn-primary mt-3 rounded-pill px-4">
              <ArrowLeftCircle size={18} className="me-1" /> Tiếp tục mua sắm
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
                      {cartItems.map((item) => {
                        const price = item.product?.discount
                          ? (item.product.price *
                              (100 - item.product.discount)) /
                            100
                          : item.product?.price || 0;
                        return (
                          <tr key={item.id}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                              />
                            </td>
                            <td style={{ width: "80px" }}>
                              <img
                                src={getImage(item.product?.image)}
                                alt={item.product?.name}
                                className="img-fluid rounded-3"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td className="text-start fw-semibold">
                              {item.product?.name}
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
                            <td style={{ width: "110px" }}>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.quantity || 1}
                                className="text-center rounded-pill border-primary"
                                onChange={(e) =>
                                  handleQtyChange(item.id, +e.target.value)
                                }
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
                </Card.Body>
              </Card>
            </Col>

            {/* Cột tổng tiền */}
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
