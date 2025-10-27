import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { createVnpayPayment } from "../../api/paymentApi";

const CheckoutForm = ({
  user,
  total,
  selectedItems,
  onOrderComplete,
  isSingleProduct,
}) => {
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

    if (!formData.address || !formData.phone) {
      return toast.warning("Vui lòng nhập đầy đủ thông tin giao hàng!");
    }

    const orderData = buildOrderData();

    if (formData.paymentMethod === "vnpay") {
      try {
        const paymentUrl = await createVnpayPayment({
          orderId: `ORD${Date.now()}`,
          amount: Math.round(total), // tiền VNĐ nguyên
        });
        const newWindow = window.open(paymentUrl, "_blank");
        if (!newWindow) {
          toast.error("Vui lòng cho phép popup để thanh toán VNPay!");
        }
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
    toast.success("Thanh toán PayPal thành công!");
    await onOrderComplete(
      { ...buildOrderData(), paymentMethod: "paypal" },
      details
    );
  };

  return (
    <Card className="p-4 shadow-sm border-0 mb-4">
      <h5 className="fw-bold mb-3 text-secondary">Thông tin giao hàng</h5>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
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
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="momo">MOMO</option>
                <option value="paypal">PAYPAL</option>
                <option value="vnpay">VNPAY</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {formData.paymentMethod === "paypal" ? (
          <div className="mt-4">
            <PayPalButtons
              style={{ layout: "vertical" }}
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
        ) : (
          <Button type="submit" className="btn-primary w-100 mt-4">
            Xác nhận thanh toán
          </Button>
        )}
      </Form>

      <Link
        to={isSingleProduct ? "/" : "/cart"}
        className="btn btn-outline-secondary mt-2"
      >
        <ArrowLeftCircle size={18} className="me-1" /> Quay lại
      </Link>
    </Card>
  );
};

export default CheckoutForm;
