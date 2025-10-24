import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import { getAllOrders } from "../../api/orderApi"; // gọi API thật
import "./OrderHistory.scss";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="order-history-page py-2">
      <Container>
        <h2 className="text-center mb-4">Lịch sử đơn hàng</h2>

        {orders.length === 0 ? (
          <p className="text-center text-muted mt-4">
            Bạn chưa có đơn hàng nào.
          </p>
        ) : (
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
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{Number(order.total).toLocaleString()} ₫</td>
                  <td>{renderStatus(order.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/orders-detail/${order.id}`)}
                    >
                      <Eye className="me-1" /> Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default OrderHistory;
