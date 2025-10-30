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
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../../api/orderApi";
import "./OrderDetail.scss";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProgressVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "processing":
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 25;
      case "confirmed":
        return 50;
      case "processing":
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Chờ xử lý</Badge>;
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
        return <Badge bg="secondary">Không rõ</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    if (status?.toLowerCase() === "paid") {
      return (
        <Badge bg="success" className="fs-7">
          Đã thanh toán
        </Badge>
      );
    }
    if (status?.toLowerCase() === "unpaid") {
      return (
        <Badge bg="danger" className="fs-7">
          Chưa thanh toán
        </Badge>
      );
    }
    return (
      <Badge bg="secondary" className="fs-7">
        Đang xử lý
      </Badge>
    );
  };

  const getReturnBadge = (status) => {
    switch (status) {
      case "none":
        return <Badge bg="secondary">Không trả</Badge>;
      case "requested":
        return <Badge bg="warning">Đã yêu cầu</Badge>;
      case "approved":
        return <Badge bg="success">Được duyệt</Badge>;
      case "rejected":
        return <Badge bg="danger">Bị từ chối</Badge>;
      case "completed":
        return <Badge bg="primary">Hoàn tất</Badge>;
      default:
        return <Badge bg="secondary">{status || "none"}</Badge>;
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (res.errCode === 0) {
          setOrder(res.data);
        } else {
          toast.error(res.errMessage || "Không tìm thấy đơn hàng");
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!order)
    return <p className="text-center mt-5">Không có dữ liệu đơn hàng</p>;

  return (
    <div className="order-detail-page py-4">
      <Container>
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => navigate("/orders")}
        >
          ← Quay lại Lịch sử đơn hàng
        </Button>

        <h3 className="mb-3 text-center fw-bold text-primary">
          Chi tiết đơn hàng #DH{order.id}
        </h3>

        <Card className="mb-4 shadow-sm border-0">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5 className="fw-semibold mb-3 text-secondary">
                  👤 Thông tin người nhận
                </h5>
                <p>
                  <strong>Họ tên:</strong> {order.user?.username}
                </p>
                <p>
                  <strong>Email:</strong> {order.user?.email}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.shippingAddress}
                </p>
                {order.note && (
                  <p>
                    <strong>Ghi chú:</strong> {order.note}
                  </p>
                )}
              </Col>

              <Col md={6}>
                <h5 className="fw-semibold mb-3 text-secondary">
                  🧾 Thông tin đơn hàng
                </h5>
                <p>
                  <strong>Ngày đặt:</strong>{" "}
                  {new Date(
                    order.orderDate || order.createdAt
                  ).toLocaleDateString()}
                </p>
                {order.deliveredAt && (
                  <p>
                    <strong>Ngày giao:</strong>{" "}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                )}
                <p>
                  <strong>Trạng thái:</strong> {getStatusBadge(order.status)}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {order.paymentMethod?.toUpperCase()}
                </p>
                <div className="mt-2">
                  <strong>Trạng thái thanh toán:</strong>{" "}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
                <p className="mt-3">
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="text-danger fw-bold">
                    {parseFloat(order.totalPrice).toLocaleString()} ₫
                  </span>
                </p>

                <ProgressBar
                  now={getProgress(order.status)}
                  label={`${getProgress(order.status)}%`}
                  variant={getProgressVariant(order.status)}
                  className="mt-3"
                  style={{ height: "12px", borderRadius: "6px" }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <h5 className="fw-semibold mb-3 text-secondary">
          📦 Sản phẩm trong đơn hàng
        </h5>
        <Table responsive bordered hover className="align-middle shadow-sm">
          <thead className="table-primary text-center">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
              <th>Trạng thái trả hàng</th>
              <th>Lý do trả hàng</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item) => {
              const price = parseFloat(item.price || 0);
              const subtotal = price * (item.quantity || 0);
              return (
                <tr key={item.id} className="text-center">
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{price.toLocaleString()} ₫</td>
                  <td>{subtotal.toLocaleString()} ₫</td>
                  <td>{getReturnBadge(item.returnStatus)}</td>
                  <td>{item.returnReason || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="text-end mt-4">
          <h5 className="fw-bold">
            Tổng cộng:{" "}
            <span className="text-danger fs-5">
              {parseFloat(order.totalPrice).toLocaleString()} ₫
            </span>
          </h5>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetail;
