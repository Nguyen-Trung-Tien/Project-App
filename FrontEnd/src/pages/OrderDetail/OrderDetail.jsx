import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  ProgressBar,
  Button,
  Card,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetail.scss";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Giả lập dữ liệu API đơn hàng
    const fakeOrder = {
      id: id,
      date: "2025-10-18",
      status: "shipping",
      total: 780000,
      customer: {
        name: "Nguyễn Trung Tiến",
        phone: "0912345678",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        email: "trungtien@example.com",
      },
      products: [
        {
          id: 1,
          name: "Áo thun ReactJS",
          price: 250000,
          quantity: 2,
          image: "/images/product1.jpg",
        },
        {
          id: 2,
          name: "Mũ lập trình viên",
          price: 280000,
          quantity: 1,
          image: "/images/product2.jpg",
        },
      ],
    };
    setOrder(fakeOrder);
  }, [id]);

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 25;
      case "confirmed":
        return 50;
      case "shipping":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xử lý
          </Badge>
        );
      case "confirmed":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "shipping":
        return <Badge bg="primary">Đang giao</Badge>;
      case "delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không rõ</Badge>;
    }
  };

  if (!order) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  return (
    <div className="order-detail-page py-5">
      <Container>
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => navigate("/orders")}
        >
          ← Quay lại Lịch sử đơn hàng
        </Button>

        <h2 className="mb-4 text-center text-primary">
          Chi tiết đơn hàng #{order.id}
        </h2>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Thông tin người nhận</h5>
                <p>
                  <strong>Họ tên:</strong> {order.customer.name}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {order.customer.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.customer.address}
                </p>
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
              </Col>
              <Col md={6}>
                <h5>Thông tin đơn hàng</h5>
                <p>
                  <strong>Ngày đặt:</strong> {order.date}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {getBadge(order.status)}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {order.total.toLocaleString()} ₫
                </p>
                <ProgressBar
                  now={getProgress(order.status)}
                  label={`${getProgress(order.status)}%`}
                  className="mt-3"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <h4 className="mb-3">Sản phẩm trong đơn hàng</h4>
        <Table responsive bordered hover className="product-table">
          <thead>
            <tr className="text-center">
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item) => (
              <tr key={item.id} className="align-middle text-center">
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-img"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()} ₫</td>
                <td>{(item.price * item.quantity).toLocaleString()} ₫</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="text-end mt-4">
          <h5>
            Tổng cộng:{" "}
            <strong className="text-danger">
              {order.total.toLocaleString()} ₫
            </strong>
          </h5>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetail;
