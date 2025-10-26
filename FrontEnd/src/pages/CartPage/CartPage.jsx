import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { Trash, ArrowLeftCircle } from "react-bootstrap-icons";
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
import "./CartPage.scss";
import { getImage } from "../../utils/decodeImage";

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
      dispatch(setCartItems(res.data || []));
      setSelectedItems(res.data?.map((item) => item.id) || []);
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
      console.error(err);
      toast.error("Xóa thất bại!");
    }
  };

  const handleQtyChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(id, quantity);
      dispatch(updateCartItemQuantity({ id, quantity }));
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật số lượng thất bại!");
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
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
    <div className="cart-page">
      <Container>
        <h2 className="text-center mb-4 fw-bold">🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <div className="text-center empty-cart">
            <p>Giỏ hàng trống.</p>
            <Link to="/" className="btn btn-primary mt-3">
              <ArrowLeftCircle size={20} className="me-1" /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <Row>
            <Col lg={8}>
              <Table
                responsive
                bordered
                hover
                className="cart-table align-middle"
              >
                <thead>
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
                    <th>Sản phẩm</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const price = item.product?.discount
                      ? (item.product.price * (100 - item.product.discount)) /
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
                        <td>
                          <img
                            src={getImage(item.product?.image)}
                            alt={item.product?.name || "Sản phẩm"}
                            className="cart-img"
                          />
                        </td>
                        <td>{item.product?.name || "N/A"}</td>
                        <td>
                          {item.product?.discount > 0 ? (
                            <>
                              <span className="text-decoration-line-through">
                                {(item.product.price || 0).toLocaleString()}₫
                              </span>{" "}
                              <span className="text-danger fw-bold">
                                {price.toLocaleString()}₫
                              </span>
                            </>
                          ) : (
                            (item.product?.price || 0).toLocaleString() + "₫"
                          )}
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            className="cart-qty"
                            onChange={(e) =>
                              handleQtyChange(item.id, Number(e.target.value))
                            }
                          />
                        </td>
                        <td>
                          {(price * (item.quantity || 0)).toLocaleString()}₫
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col lg={4}>
              <div className="cart-summary shadow-sm p-3">
                <h5 className="fw-bold mb-3">Tổng thanh toán</h5>
                <p className="mb-2">
                  Tạm tính: <span>{total.toLocaleString()}₫</span>
                </p>
                <p className="fw-semibold">
                  Phí vận chuyển: <span>Miễn phí</span>
                </p>
                <hr />
                <h5 className="fw-bold">
                  Tổng cộng:{" "}
                  <span className="text-primary">
                    {total.toLocaleString()}₫
                  </span>
                </h5>
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleCheckOut}
                >
                  Tiến hành thanh toán
                </Button>
                <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                  <ArrowLeftCircle size={18} className="me-1" />
                  Quay lại trang chủ
                </Link>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
