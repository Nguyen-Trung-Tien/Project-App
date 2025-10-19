import React from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { Trash, ArrowLeftCircle } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.scss";

const CartPage = () => {
  const navigate = useNavigate();
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

  const handleCheckOut = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <Container>
        <h2 className="text-center mb-4 fw-bold">🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <div className="text-center empty-cart">
            <p>Giỏ hàng trống.</p>
            <Link to="/" className="btn btn-primary mt-3">
              <ArrowLeftCircle size={20} className="me-1" />
              Tiếp tục mua sắm
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
                    <th>Sản phẩm</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-img"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.price.toLocaleString()}₫</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.qty}
                          className="cart-qty"
                        />
                      </td>
                      <td>{(item.price * item.qty).toLocaleString()}₫</td>
                      <td>
                        <Button variant="outline-danger" size="sm">
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col lg={4}>
              <div className="cart-summary shadow-sm">
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
                  onClick={() => handleCheckOut()}
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
