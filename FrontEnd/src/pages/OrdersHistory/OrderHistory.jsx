import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Spinner,
  Card,
  Pagination,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftCircle, Eye } from "react-bootstrap-icons";
import { getOrdersByUserId } from "../../api/orderApi";
import "./OrderHistory.scss";
import { useSelector } from "react-redux";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id || !token) return;
      try {
        setLoading(true);
        const res = await getOrdersByUserId(token, user.id, page, 8);
        if (res?.errCode === 0) {
          setOrders(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
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
  }, [user, token, page]);

  useEffect(() => {
    setPage(1);
  }, [user?.id]);
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
      case "shipped":
        return <Badge bg="primary">Đang giao</Badge>;
      case "delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const renderPaginationItems = () => {
    const items = [];
    const delta = 2;

    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (left > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let i = left; i <= right; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (right < totalPages) {
      if (right < totalPages - 1)
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  const formatCurrency = (value) =>
    parseFloat(value || 0).toLocaleString("vi-VN") + " ₫";

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-";

  return (
    <div className="order-history-page py-2">
      <Container>
        <div className="text-left">
          <Link
            to={"/orders"}
            className="btn btn-outline-primary rounded-pill px-3 py-2 mb-2 fw-semibold"
          >
            <ArrowLeftCircle size={16} className="me-1" />
            Quay lại
          </Link>
        </div>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h3 className="text-center fw-bold mb-2 text-primary">
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
        <div className="d-flex justify-content-center mt-3">
          <Pagination>{renderPaginationItems()}</Pagination>
        </div>
      </Container>
    </div>
  );
};

export default OrderHistory;
