import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Cash,
  CreditCard2Back,
  Paypal,
  Phone,
  GeoAlt,
  Person,
  Envelope,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { createVnpayPayment } from "../../api/paymentApi";
import "./CheckoutForm.scss";

const CheckoutForm = ({ user, total, selectedItems, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    address: "",
    email: "",
    note: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
        note: user.note || "",
        paymentMethod: "cod",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const buildOrderData = () => ({
    userId: user.id,
    totalPrice: total,
    shippingAddress: formData.address,
    paymentMethod: formData.paymentMethod,
    note: formData.note || "",
    orderItems: selectedItems.map((item) => {
      const price = item.product?.discount
        ? (item.product.price * (100 - item.product.discount)) / 100
        : item.product.price;
      return {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price,
        subtotal: price * item.quantity,
        cartItemId: item.id,
      };
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.address)
      return toast.warning("Vui lòng nhập đầy đủ thông tin!");

    if (formData.paymentMethod === "vnpay") {
      const url = await createVnpayPayment({
        orderId: `ORD${Date.now()}`,
        amount: Math.round(total),
      });
      window.open(url);
      return;
    }

    await onOrderComplete(buildOrderData());
  };

  const handlePayPalApprove = async (data, actions) => {
    const details = await actions.order.capture();
    await onOrderComplete(
      { ...buildOrderData(), paymentMethod: "paypal" },
      details
    );
  };

  return (
    <Card className="checkout-card">
      <h4 className="checkout-title">
        <GeoAlt /> Thông tin giao hàng
      </h4>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control
              placeholder="Họ và tên"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={6}>
            <Form.Control
              placeholder="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={12}>
            <Form.Control
              placeholder="Địa chỉ giao hàng"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={6}>
            <Form.Control
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>

          <Col md={6}>
            <Form.Control
              placeholder="Ghi chú (nếu có)"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* PAYMENT */}
        <div className="mt-4">
          <h6 className="fw-semibold mb-3">
            <CreditCard2Back /> Phương thức thanh toán
          </h6>

          <Row className="g-3">
            <Col md={4}>
              <div
                className={`payment-card ${
                  formData.paymentMethod === "cod" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "cod" })
                }
              >
                <Cash /> COD
              </div>
            </Col>

            <Col md={4}>
              <div
                className={`payment-card ${
                  formData.paymentMethod === "paypal" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "paypal" })
                }
              >
                <Paypal /> PayPal
              </div>
            </Col>

            <Col md={4}>
              <div
                className={`payment-card ${
                  formData.paymentMethod === "vnpay" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "vnpay" })
                }
              >
                <CreditCard2Back /> VNPay
              </div>
            </Col>
          </Row>
        </div>

        {/* ACTION */}
        <div className="checkout-action mt-4">
          {formData.paymentMethod === "paypal" ? (
            <PayPalButtons
              style={{ layout: "vertical", shape: "pill" }}
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    { amount: { value: (total / 25000).toFixed(2) } },
                  ],
                })
              }
              onApprove={handlePayPalApprove}
            />
          ) : (
            <Button type="submit" className="checkout-btn">
              Thanh toán {total.toLocaleString()}đ
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default CheckoutForm;
