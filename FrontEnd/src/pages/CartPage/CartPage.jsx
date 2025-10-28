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
    } catch (err) {
      console.log(err);
      toast.error("Xóa thất bại!");
    }
  };

  const handleQtyChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(id, quantity);
      dispatch(updateCartItemQuantity({ id, quantity }));
    } catch (err) {
      console.log(err);
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
    <div className="cart-page py-4">
      <Container>
        <h2 className="text-center mb-4 fw-bold text-primary">
          <Cart4 className="me-2" />
          Giỏ hàng của bạn
        </h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải giỏ hàng...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Giỏ hàng trống.</p>
            <Link to="/" className="btn btn-primary mt-3 rounded-pill px-4">
              <ArrowLeftCircle size={18} className="me-1" /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {/* Bảng sản phẩm */}
            <Col lg={8}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Table
                    responsive
                    bordered
                    hover
                    className="align-middle text-center mb-0"
                  >
                    <thead className="bg-light">
                      <tr>
                        <th>
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
                                alt={item.product?.name || "Sản phẩm"}
                                className="img-fluid rounded shadow-sm"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td className="text-start fw-semibold">
                              {item.product?.name || "N/A"}
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
                                <div>{price.toLocaleString()}₫</div>
                              )}
                            </td>
                            <td style={{ width: "100px" }}>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.quantity || 1}
                                className="text-center rounded-3"
                                onChange={(e) =>
                                  handleQtyChange(item.id, +e.target.value)
                                }
                              />
                            </td>
                            <td className="fw-bold text-end">
                              {(price * (item.quantity || 0)).toLocaleString()}₫
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash size={16} />
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

            {/* Tổng kết giỏ hàng */}
            <Col lg={4}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3 text-center text-primary">
                    Tổng thanh toán
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
                    className="w-100 mt-3 rounded-pill fw-semibold shadow-sm"
                    onClick={handleCheckOut}
                  >
                    Tiến hành thanh toán
                  </Button>
                  <Link
                    to="/"
                    className="btn btn-outline-secondary w-100 mt-2 rounded-pill"
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
