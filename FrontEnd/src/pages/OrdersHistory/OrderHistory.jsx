import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import { getAllOrders } from "../../api/orderApi";
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
        if (res?.errCode === 0) {
          setOrders(res.data || []);
        } else {
          console.error("Lỗi API:", res.errMessage);
        }
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
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xử lý
          </Badge>
        );
      case "confirmed":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "processing":
      case "shipping":
        return <Badge bg="primary">Đang giao</Badge>;
      case "delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatCurrency = (value) =>
    parseFloat(value || 0).toLocaleString("vi-VN") + " ₫";

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-";

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
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
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td>
                    <strong> {`DH${order.id}`}</strong>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                  <td>{order.paymentStatus?.toUpperCase() || "-"}</td>
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
