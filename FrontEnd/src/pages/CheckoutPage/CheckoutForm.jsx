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

const CheckoutForm = ({ user, total, selectedItems, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
        paymentMethod: "cod",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const buildOrderData = () => {
    const orderItems = selectedItems.map((item) => {
      const price = item.product?.discount
        ? (item.product.price * (100 - item.product.discount)) / 100
        : item.product?.price || 0;
      return {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price,
        subtotal: price * item.quantity,
        cartItemId: item.id,
      };
    });

    return {
      userId: user.id,
      totalPrice: total,
      shippingAddress: formData.address,
      paymentMethod: formData.paymentMethod,
      note: "",
      orderItems,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.phone)
      return toast.warning("Vui lòng nhập đầy đủ thông tin giao hàng!");

    const orderData = buildOrderData();

    if (formData.paymentMethod === "vnpay") {
      try {
        const paymentUrl = await createVnpayPayment({
          orderId: `ORD${Date.now()}`,
          amount: Math.round(total),
        });
        const newWindow = window.open(paymentUrl, "_blank");
        if (!newWindow)
          toast.error("Vui lòng cho phép popup để thanh toán VNPay!");
      } catch (error) {
        console.error("Error creating VNPay payment:", error);
        toast.error(error.message || "Lỗi khi tạo thanh toán VNPay!");
      }
      return;
    }

    await onOrderComplete(orderData);
  };

  const handlePayPalApprove = async (data, actions) => {
    const details = await actions.order.capture();
    await onOrderComplete(
      { ...buildOrderData(), paymentMethod: "paypal" },
      details
    );
  };

  const renderPaymentLabel = (method) => {
    switch (method) {
      case "cod":
        return (
          <>
            <Cash className="me-2 text-success" /> Thanh toán khi nhận hàng
          </>
        );
      case "paypal":
        return (
          <>
            <Paypal className="me-2 text-primary" /> Thanh toán qua PayPal
          </>
        );
      case "vnpay":
        return (
          <>
            <CreditCard2Back className="me-2 text-info" /> Thanh toán qua VNPay
          </>
        );
      default:
        return "Phương thức khác";
    }
  };

  return (
    <Card className="shadow-lg border-0 rounded-4 p-4">
      <div className="text-center mb-4">
        <h4
          className="fw-bold text-white py-2 px-3 rounded-pill d-inline-block"
          style={{
            background: "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)",
          }}
        >
          <GeoAlt className="me-2" />
          Thông tin giao hàng
        </h4>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="gy-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                <Person className="me-1" /> Họ và tên
              </Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="rounded-3 shadow-sm"
                placeholder="Nhập họ và tên..."
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                <Phone className="me-1" /> Số điện thoại
              </Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="rounded-3 shadow-sm"
                placeholder="Nhập số điện thoại..."
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                <GeoAlt className="me-1" /> Địa chỉ
              </Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="rounded-3 shadow-sm"
                placeholder="Nhập địa chỉ ..."
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                <Envelope className="me-1" /> Email
              </Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-3 shadow-sm"
                placeholder="Nhập email..."
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                <CreditCard2Back className="me-1" /> Phương thức thanh toán
              </Form.Label>
              <Form.Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="rounded-3 shadow-sm"
              >
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="paypal">PayPal</option>
                <option value="vnpay">VNPay</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {formData.paymentMethod === "paypal" ? (
          <div className="mt-4 text-center">
            <div className="d-inline-block" style={{ width: "180px" }}>
              <PayPalButtons
                style={{
                  layout: "horizontal",
                  height: 40,
                  tagline: false,
                  shape: "pill",
                  color: "gold",
                }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      { amount: { value: (total / 25000).toFixed(2) } },
                    ],
                  })
                }
                onApprove={handlePayPalApprove}
                onError={() => toast.error("Thanh toán PayPal thất bại!")}
              />
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            <Button
              type="submit"
              className="rounded-pill px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center justify-content-center"
              style={{
                fontSize: "1rem",
                minWidth: "220px",
                background: "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)",
                border: "none",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "brightness(1)")
              }
            >
              {renderPaymentLabel(formData.paymentMethod)}
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default CheckoutForm;
