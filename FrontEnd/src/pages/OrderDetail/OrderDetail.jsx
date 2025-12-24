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
  Form,
  Modal,
} from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../../api/orderApi";
import { requestReturn } from "../../api/orderItemApi";
import "./OrderDetail.scss";
import { useSelector } from "react-redux";
import { getImage } from "../../utils/decodeImage";

const OrderDetail = () => {
  const token = useSelector((state) => state.user.token);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");

  const [submitting, setSubmitting] = useState(false);

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
      case "cancelled":
        return 100;
      default:
        return 0;
    }
  };
  const Info = ({ label, value }) => (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );

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
      return <Badge bg="success">Đã thanh toán</Badge>;
    }
    if (status?.toLowerCase() === "unpaid") {
      return <Badge bg="danger">Chưa thanh toán</Badge>;
    }
    if (status?.toLowerCase() === "refunded") {
      return <Badge bg="warning">Đã hoàn tiền</Badge>;
    }
    return <Badge bg="secondary">Đang xử lý</Badge>;
  };

  const getReturnBadge = (status) => {
    switch (status) {
      case "none":
        return <Badge bg="secondary">Không trả</Badge>;
      case "pending":
        return <Badge bg="warning">Chờ xử lý</Badge>;
      case "approved":
        return <Badge bg="success">Được duyệt</Badge>;
      case "rejected":
        return <Badge bg="danger">Từ chối</Badge>;
      case "completed":
        return <Badge bg="primary">Hoàn tất</Badge>;
      default:
        return <Badge bg="secondary">{status || "none"}</Badge>;
    }
  };

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id, token);

      if (res.errCode === 0) {
        setOrder(res.data);
      } else if (res.errCode === 2) {
        toast.error("Bạn không có quyền xem đơn hàng này");
      } else {
        toast.error(res.errMessage);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không được phép xem đơn hàng này");
      } else {
        toast.error("Lỗi khi tải đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const openReturnModal = () => {
    if (order.status !== "delivered") {
      toast.warning("Chỉ có thể trả hàng khi đơn đã giao.");
      return;
    }
    const items =
      order.orderItems?.filter((i) => i.returnStatus === "none") || [];
    if (!items.length) {
      toast.info("Không có sản phẩm nào có thể trả.");
      return;
    }

    setSelectedItems(items.map((i) => i.id));
    setReturnReason("");
    setShowReturnModal(true);
  };

  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitReturn = async () => {
    if (submitting) return;
    if (!returnReason.trim())
      return toast.warning("Vui lòng nhập lý do trả hàng");
    if (!selectedItems.length)
      return toast.warning("Vui lòng chọn ít nhất 1 sản phẩm");

    setSubmitting(true);
    try {
      await Promise.all(
        selectedItems.map((itemId) =>
          requestReturn(itemId, returnReason, token).catch((err) => {
            console.error(`Lỗi trả hàng ID ${itemId}:`, err);
            throw err;
          })
        )
      );
      toast.success("Gửi yêu cầu trả hàng thành công!");
      setShowReturnModal(false);
      fetchOrderDetail();
    } catch {
      toast.error("Một số sản phẩm không thể trả. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!order)
    return <p className="text-center mt-5">Không có dữ liệu đơn hàng</p>;

  return (
    <div className="order-detail-page py-3">
      <Container>
        <div className="order-title">
          <span className="order-title__icon">🧾</span>
          <div>
            <h3 className="order-title__text">
              Chi tiết đơn hàng
              <span className="order-title__id"> #DH{order.id}</span>
            </h3>
            <p className="order-title__sub">
              Theo dõi trạng thái và thông tin đơn hàng của bạn
            </p>
          </div>
        </div>

        <Card className="order-header mb-4 shadow-sm border-0">
          <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">
                Đơn hàng <span className="text-primary">#DH{order.id}</span>
              </h4>
              <div className="d-flex align-items-center gap-2">
                {getStatusBadge(order.status)}
                {getPaymentBadge(order.paymentStatus)}
              </div>
            </div>

            <div style={{ minWidth: 220 }}>
              <small className="text-muted">Tiến trình đơn hàng</small>
              <ProgressBar
                now={getProgress(order.status)}
                variant={getProgressVariant(order.status)}
                className="mt-1"
                style={{ height: 10, borderRadius: 8 }}
              />
            </div>
          </Card.Body>
        </Card>

        {/* ===== INFO ===== */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Card className="info-card shadow-sm border-0 h-100">
              <Card.Body>
                <h6 className="section-title">👤 Người nhận</h6>
                <Info label="Họ tên" value={order.user?.username || "Khách"} />
                <Info label="SĐT" value={order.user?.phone} />
                <Info label="Email" value={order.user?.email} />
                <Info label="Địa chỉ" value={order.shippingAddress} />
                {order.note && <Info label="Ghi chú" value={order.note} />}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="info-card shadow-sm border-0 h-100">
              <Card.Body>
                <h6 className="section-title">🧾 Thanh toán</h6>
                <Info
                  label="Ngày đặt"
                  value={new Date(
                    order.orderDate || order.createdAt
                  ).toLocaleDateString("vi-VN")}
                />
                {order.deliveredAt && (
                  <Info
                    label="Ngày giao"
                    value={new Date(order.deliveredAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  />
                )}
                <Info
                  label="Phương thức"
                  value={order.paymentMethod?.toUpperCase()}
                />

                <div className="total-box mt-3">
                  <span>Tổng tiền</span>
                  <strong className="text-danger">
                    {Number(order.totalPrice).toLocaleString("vi-VN")} ₫
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== PRODUCTS ===== */}
        <h5 className="fw-semibold mb-3">📦 Sản phẩm</h5>

        <div className="product-list">
          {order.orderItems?.map((item) => {
            const product = item.product || {};
            const subtotal = item.price * item.quantity;

            return (
              <Card key={item.id} className="product-card shadow-sm border-0">
                <Card.Body className="d-flex gap-3">
                  <img
                    src={getImage(product.image)}
                    alt={product.name}
                    className="product-img"
                  />

                  <div className="flex-grow-1">
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="product-name"
                    >
                      {product.name || item.productName}
                    </Link>

                    <div className="text-muted small mt-1">
                      SL: {item.quantity} · Giá: {item.price.toLocaleString()} ₫
                    </div>

                    <div className="mt-2">
                      {getReturnBadge(item.returnStatus)}
                      {item.returnReason && (
                        <div className="small text-muted mt-1">
                          Lý do: {item.returnReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-end fw-bold">
                    {subtotal.toLocaleString()} ₫
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* ===== RETURN BUTTON ===== */}
        {order.status === "delivered" &&
          order.orderItems?.some((i) => i.returnStatus === "none") && (
            <div className="text-end mt-4">
              <Button variant="warning" size="lg" onClick={openReturnModal}>
                Yêu cầu trả hàng
              </Button>
            </div>
          )}

        <Modal
          show={showReturnModal}
          onHide={() => setShowReturnModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>🛒 Yêu cầu trả hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Lý do trả hàng</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Nhập lý do trả hàng..."
              />
            </Form.Group>

            <Form.Label>Chọn sản phẩm muốn trả</Form.Label>
            <div className="border rounded p-2">
              {order.orderItems
                ?.filter((i) => i.returnStatus === "none")
                .map((item) => (
                  <Form.Check
                    key={item.id}
                    type="checkbox"
                    label={`${item.productName} (SL: ${item.quantity})`}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleItem(item.id)}
                  />
                ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowReturnModal(false)}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitReturn}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  Đang gửi <Spinner size="sm" />
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default OrderDetail;
