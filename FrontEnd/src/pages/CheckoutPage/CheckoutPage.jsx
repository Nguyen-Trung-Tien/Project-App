import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import "./CheckoutPage.scss";
import { createOrder } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi";
import { removeCartItem } from "../../redux/cartSlice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { selectedIds } = location.state || {};
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user.user);

  // Lọc sản phẩm đã chọn
  const selectedItems = cartItems.filter((item) =>
    selectedIds?.includes(item.id)
  );

  // Tính tổng tiền
  const total = selectedItems.reduce((acc, item) => {
    const price = item.product?.discount
      ? (item.product.price * (100 - item.product.discount)) / 100
      : item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItems.length)
      return toast.warning("Không có sản phẩm để thanh toán!");
    if (!formData.address || !formData.phone)
      return toast.warning("Vui lòng nhập đầy đủ thông tin giao hàng!");

    try {
      // Chuẩn bị dữ liệu gửi lên backend
      const orderItems = selectedItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.quantity * item.product.price,
        cartItemId: item.id,
      }));

      const orderData = {
        userId: user.id,
        totalPrice: total,
        shippingAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        note: "",
        orderItems,
      };

      // Tạo order + giảm stock + xóa giỏ hàng trong 1 API
      const orderRes = await createOrder(orderData);

      if (orderRes.errCode !== 0) {
        toast.error(orderRes.errMessage || "Lỗi khi tạo đơn hàng!");
        return;
      }

      const orderId = orderRes.data.id;

      // Gọi API thanh toán (nếu cần)
      const paymentRes = await createPayment({
        orderId,
        userId: user.id,
        amount: total,
        paymentMethod: formData.paymentMethod,
        status:
          formData.paymentMethod === "COD"
            ? "Chưa thanh toán"
            : "Đã thanh toán",
      });

      if (paymentRes.errCode && paymentRes.errCode !== 0) {
        toast.error(paymentRes.errMessage || "Thanh toán thất bại!");
        return;
      }

      // Cập nhật Redux: xóa khỏi giỏ hàng frontend (tránh trạng thái cũ)
      selectedItems.forEach((item) => dispatch(removeCartItem(item.id)));

      toast.success("Đặt hàng thành công!");
      navigate(`/checkout-success/${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  if (!selectedItems.length) {
    return (
      <div className="text-center mt-5">
        <h5>Không có sản phẩm nào để thanh toán!</h5>
        <Link to="/cart" className="btn btn-primary mt-3">
          <ArrowLeftCircle size={20} className="me-1" /> Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Container>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart">Giỏ hàng</Link>
            </li>
            <li className="breadcrumb-item active">Thanh toán</li>
          </ol>
        </nav>

        <h2 className="text-center mb-4 fw-bold text-primary">
          💳 Chi tiết thanh toán
        </h2>

        <Row>
          {/* LEFT: FORM */}
          <Col lg={8}>
            <Card className="p-4 shadow-sm border-0 mb-4">
              <h5 className="fw-bold mb-3 text-secondary">
                Thông tin giao hàng
              </h5>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phương thức thanh toán</Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="COD">
                          Thanh toán khi nhận hàng (COD)
                        </option>
                        <option value="BANK">Chuyển khoản ngân hàng</option>
                        <option value="MOMO">
                          Ví điện tử (Momo, ZaloPay...)
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" className="btn-primary w-100 mt-4">
                  Xác nhận thanh toán
                </Button>
              </Form>
            </Card>

            <Link to="/cart" className="btn btn-outline-secondary mt-2">
              <ArrowLeftCircle size={18} className="me-1" />
              Quay lại giỏ hàng
            </Link>
          </Col>

          {/* RIGHT: SUMMARY */}
          <Col lg={4}>
            <Card className="p-3 shadow-sm border-0">
              <h5 className="fw-bold text-secondary mb-3">Tóm tắt đơn hàng</h5>

              {selectedItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.product?.image || "/no-image.jpg"}
                    alt={item.product?.name}
                    className="checkout-img me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-semibold">{item.product?.name}</p>
                    <small className="text-muted">
                      {item.quantity} x{" "}
                      {(item.product?.discount
                        ? (item.product.price * (100 - item.product.discount)) /
                          100
                        : item.product.price
                      ).toLocaleString()}
                      ₫
                    </small>
                  </div>
                </div>
              ))}

              <hr />
              <p className="fw-semibold d-flex justify-content-between">
                Tạm tính: <span>{total.toLocaleString()}₫</span>
              </p>
              <p className="fw-semibold d-flex justify-content-between">
                Phí vận chuyển: <span className="text-success">Miễn phí</span>
              </p>
              <hr />
              <h5 className="fw-bold d-flex justify-content-between text-primary">
                Tổng cộng: <span>{total.toLocaleString()}₫</span>
              </h5>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;
