import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import "./OrderHistory.scss";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 Giả lập API
    const demoOrders = [
      {
        id: "OD123456",
        date: "2025-10-15",
        total: 1250000,
        status: "delivered",
      },
      {
        id: "OD123457",
        date: "2025-10-17",
        total: 780000,
        status: "shipping",
      },
      {
        id: "OD123458",
        date: "2025-10-18",
        total: 355000,
        status: "pending",
      },
    ];
    setOrders(demoOrders);
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "shipping":
        return <Badge bg="info">Đang giao</Badge>;
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xử lý
          </Badge>
        );
      case "cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="order-history-page py-2">
      <Container>
        <h2 className="text-center mb-4">Lịch sử đơn hàng</h2>

        <Table responsive bordered hover className="order-table">
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>{order.date}</td>
                <td>{order.total.toLocaleString()} ₫</td>
                <td>{renderStatus(order.status)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Eye className="me-1" /> Xem
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {orders.length === 0 && (
          <p className="text-center text-muted mt-4">
            Bạn chưa có đơn hàng nào.
          </p>
        )}
      </Container>
    </div>
  );
};

export default OrderHistory;
