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

const OrderDetail = () => {
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;
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
                  <strong>Họ tên: </strong>
                  {order.user?.username || "Khách hàng"}
                </p>
                <p>
                  <strong>SĐT: </strong>
                  {order.user?.phone}
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
                  ).toLocaleDateString("vi-VN")}
                </p>
                {order.deliveredAt && (
                  <p>
                    <strong>Ngày giao:</strong>{" "}
                    {new Date(order.deliveredAt).toLocaleDateString("vi-VN")}
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
                    {parseFloat(order.totalPrice).toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    ₫
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
                  <td className="product-td">
                    <Link
                      to={`/product-detail/${item.productId}`}
                      className="product-link"
                    >
                      {item.productName}
                    </Link>
                  </td>

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

        {order.status === "delivered" &&
          order.orderItems?.some((item) => item.returnStatus === "none") && (
            <div className="text-end mt-3">
              <Button variant="warning" onClick={openReturnModal}>
                Trả hàng
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
