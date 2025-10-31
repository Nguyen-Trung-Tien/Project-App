import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftCircle, Eye } from "react-bootstrap-icons";
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

  const renderPaymentStatus = (status) => {
    if (!status) return <Badge bg="secondary">Không rõ</Badge>;

    const lower = status.toLowerCase();
    if (lower === "paid")
      return (
        <Badge bg="success" className="px-1">
          Đã thanh toán
        </Badge>
      );
    if (lower === "unpaid")
      return (
        <Badge bg="danger" className="px-1">
          Chưa thanh toán
        </Badge>
      );
    return (
      <Badge bg="warning" text="dark" className="px-1">
        Đang xử lý
      </Badge>
    );
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
    <div className="order-history-page py-4">
      <Container>
        <div className="text-left">
          <Link
            to={"/orders"}
            className="btn btn-outline-primary rounded-pill px-3 py-2 mb-3 fw-semibold"
          >
            <ArrowLeftCircle size={16} className="me-1" />
            Quay lại giỏ hàng
          </Link>
        </div>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h3 className="text-center fw-bold mb-4 text-primary">
              🧾 Lịch sử đơn hàng
            </h3>

            {orders.length === 0 ? (
              <p className="text-center text-muted mt-4">
                Bạn chưa có đơn hàng nào.
              </p>
            ) : (
              <div className="table-responsive">
                <Table
                  bordered
                  hover
                  striped
                  className="align-middle shadow-sm rounded"
                >
                  <thead className="table-primary text-center align-middle">
                    <tr>
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
                      <tr key={order.id} className="text-center">
                        <td>{index + 1}</td>
                        <td className="fw-semibold text-primary">{`DH${order.id}`}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="text-danger fw-semibold">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td>{renderPaymentStatus(order.paymentStatus)}</td>
                        <td>{renderStatus(order.status)}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center mx-auto"
                            onClick={() =>
                              navigate(`/orders-detail/${order.id}`)
                            }
                          >
                            <Eye className="me-1" /> Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default OrderHistory;
