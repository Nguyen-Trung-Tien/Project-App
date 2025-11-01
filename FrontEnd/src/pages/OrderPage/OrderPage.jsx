import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import { ArrowLeftCircle, Cart4, Eye } from "react-bootstrap-icons";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getActiveOrdersByUser, updateOrderStatus } from "../../api/orderApi";
import { requestReturn } from "../../api/orderItemApi";
import "./OrderPage.scss";

const statusLabels = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const paymentMethodLabels = {
  momo: "Momo",
  paypal: "PayPal",
  vnpay: "VNPay",
  cod: "Thanh toán khi nhận hàng",
};

const paymentStatusLabels = {
  unpaid: { label: "Chưa thanh toán", variant: "secondary" },
  paid: { label: "Đã thanh toán", variant: "success" },
  refunded: { label: "Đã hoàn tiền", variant: "info" },
};

const StatusBadge = ({ status }) => {
  const variants = {
    pending: "warning",
    confirmed: "info",
    processing: "primary",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  const variant = variants[status] || "secondary";
  return <Badge bg={variant}>{statusLabels[status] || status}</Badge>;
};

const PaymentStatusBadge = ({ status }) => {
  const info = paymentStatusLabels[status] || {
    label: status,
    variant: "secondary",
  };
  return <Badge bg={info.variant}>{info.label}</Badge>;
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const limit = 10;
  // Modal trả hàng
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");

  // Modal xác nhận hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getActiveOrdersByUser(user.id, token, page, limit);
      if (res?.errCode === 0) {
        setOrders(res.data || []);
      } else {
        toast.warning(res?.errMessage || "Không thể tải đơn hàng");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && token) {
      fetchOrders();
    }
  }, [page, user?.id, token]);

  const handleReceiveOrder = async (orderId) => {
    try {
      const res = await updateOrderStatus(orderId, "delivered");
      if (res?.errCode === 0) toast.success("Đơn hàng đã được xác nhận giao!");
      fetchOrders();
    } catch {
      toast.error("Lỗi khi nhận hàng");
    }
  };

  const confirmCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    try {
      const res = await updateOrderStatus(orderToCancel.id, "cancelled");
      if (res?.errCode === 0) toast.success("Đã hủy đơn hàng thành công!");
      fetchOrders();
    } catch {
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng");
    } finally {
      setShowCancelModal(false);
    }
  };

  const openReturnModal = (order) => {
    const items =
      order.orderItems?.filter((i) => i.returnStatus === "none") || [];
    if (!items.length) return toast.info("Không có sản phẩm nào có thể trả.");
    setCurrentOrder(order);
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
    if (!returnReason.trim())
      return toast.warning("Vui lòng nhập lý do trả hàng");
    if (!selectedItems.length)
      return toast.warning("Vui lòng chọn sản phẩm để trả");

    try {
      for (let itemId of selectedItems) {
        await requestReturn(itemId, returnReason);
      }
      toast.success("Đã gửi yêu cầu trả hàng!");
      fetchOrders();
      setShowReturnModal(false);
    } catch {
      toast.error("Lỗi khi gửi yêu cầu trả hàng");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (!filter || order.status === filter) &&
      (!user || order.userId === user.id)
  );

  const formatCurrency = (value) =>
    parseFloat(value || 0).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) =>
    new Date(dateStr || Date.now()).toLocaleDateString("vi-VN");

  return (
    <div className="order-page py-3">
      <Container>
        <div className="text-left">
          <Link
            to={"/"}
            className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
          >
            <ArrowLeftCircle size={16} className="me-1" />
            Quay lại trang chủ
          </Link>
        </div>
        <div className="text-center mb-3 position-relative">
          <div className="text-center mb-3">
            <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill order-title">
              <Cart4 size={26} className="me-2" />
              <h4 className="fw-bold mb-0">Đơn hàng</h4>
            </div>
          </div>

          <Form.Select
            className="w-auto border-primary text-primary fw-semibold rounded-pill px-3 position-absolute end-0 top-50 translate-middle-y d-none d-lg-block"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Form.Select>

          <div className="mt-3 d-block d-lg-none">
            <Form.Select
              className="w-50 mx-auto border-primary text-primary fw-semibold rounded-pill"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="table-responsive shadow rounded">
            <Table hover bordered className="align-middle text-center mb-0">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Phương thức TT</th>
                  <th>Trạng thái TT</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length ? (
                  filteredOrders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong className="text-primary">{`DH${order.id}`}</strong>
                      </td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td className="text-start">
                        {order.orderItems?.map((item) => (
                          <div key={item.id} className="mb-1">
                            <div className="fw-semibold">
                              {item.productName}
                            </div>
                            <div className="small text-muted">
                              SL: {item.quantity} ×{" "}
                              {parseFloat(item.price).toLocaleString("vi-VN")} ₫
                            </div>
                            {item.returnStatus !== "none" && (
                              <Badge
                                bg={
                                  item.returnStatus === "approved"
                                    ? "success"
                                    : item.returnStatus === "pending"
                                    ? "warning"
                                    : "danger"
                                }
                              >
                                {item.returnStatus === "approved"
                                  ? "Đã duyệt trả hàng"
                                  : item.returnStatus === "pending"
                                  ? "Chờ xử lý trả hàng"
                                  : "Từ chối trả"}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="fw-semibold text-success">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        {paymentMethodLabels[order.paymentMethod] || "Không rõ"}
                      </td>
                      <td>
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/orders-detail/${order.id}`)}
                        >
                          <Eye className="me-1" /> Xem
                        </Button>

                        {order.status === "shipped" && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReceiveOrder(order.id)}
                          >
                            Nhận hàng
                          </Button>
                        )}

                        {order.status === "pending" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => confirmCancelOrder(order)}
                          >
                            Hủy đơn
                          </Button>
                        )}

                        {order.status === "delivered" &&
                          order.orderItems?.some(
                            (item) => item.returnStatus === "none"
                          ) && (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => openReturnModal(order)}
                            >
                              Trả hàng
                            </Button>
                          )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      Không có đơn hàng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="me-2"
          >
            Trang trước
          </Button>
          <Button variant="outline-primary" onClick={() => setPage(page + 1)}>
            Trang sau
          </Button>
        </div>
        <Modal
          show={showReturnModal}
          onHide={() => setShowReturnModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>🛒 Yêu cầu trả hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentOrder && (
              <>
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
                  {currentOrder.orderItems
                    ?.filter((i) => i.returnStatus === "none")
                    .map((item) => (
                      <Form.Check
                        type="checkbox"
                        key={item.id}
                        label={`${item.productName} (SL: ${item.quantity})`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                      />
                    ))}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowReturnModal(false)}
            >
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSubmitReturn}>
              Gửi yêu cầu
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>⚠️ Xác nhận hủy đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {orderToCancel && (
              <p>
                Bạn có chắc chắn muốn hủy đơn hàng
                <strong> #{`DH${orderToCancel.id}`}</strong> không?
                <br />
                <span className="text-danger fw-semibold">
                  Hành động này không thể hoàn tác.
                </span>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
            >
              Không
            </Button>
            <Button variant="danger" onClick={handleCancelOrder}>
              Xác nhận hủy
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default OrderPage;
