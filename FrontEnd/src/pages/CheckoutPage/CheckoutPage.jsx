import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 32990000,
      qty: 1,
      image: "/images/product-1.jpg",
    },
    {
      id: 2,
      name: "MacBook Air M2",
      price: 28990000,
      qty: 1,
      image: "/images/product-2.jpg",
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanh toán thành công!");
  };

  return (
    <div className="checkout-page">
      <Container>
        <h2 className="text-center mb-4 fw-bold text-primary">
          💳 Chi tiết thanh toán
        </h2>
        <Row>
          {/* Form thông tin giao hàng */}
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
                        type="text"
                        placeholder="Nhập họ tên"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@gmail.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phương thức thanh toán</Form.Label>
                      <Form.Select>
                        <option>Thanh toán khi nhận hàng (COD)</option>
                        <option>Chuyển khoản ngân hàng</option>
                        <option>Ví điện tử (Momo, ZaloPay, ...)</option>
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

          {/* Tóm tắt đơn hàng */}
          <Col lg={4}>
            <Card className="p-3 shadow-sm border-0">
              <h5 className="fw-bold text-secondary mb-3">Tóm tắt đơn hàng</h5>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="checkout-img me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-semibold">{item.name}</p>
                    <small className="text-muted">
                      {item.qty} x {item.price.toLocaleString()}₫
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
