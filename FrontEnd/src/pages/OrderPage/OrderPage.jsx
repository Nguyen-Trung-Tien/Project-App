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
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
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
  cod: "COD (Thanh toán khi nhận hàng)",
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
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧾 Modal trả hàng
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");

  // 🟢 Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res?.errCode === 0 && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        toast.warning(res?.errMessage || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Nhận hàng
  const handleReceiveOrder = async (orderId) => {
    try {
      const res = await updateOrderStatus(orderId, "delivered");
      if (res?.errCode === 0) toast.success("Đơn hàng đã được xác nhận giao!");
      else toast.warning(res?.errMessage || "Không thể cập nhật trạng thái");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi nhận hàng");
    }
  };

  // ✅ Hủy đơn
  const handleCancelOrder = async (orderId) => {
    try {
      const res = await updateOrderStatus(orderId, "cancelled");
      if (res?.errCode === 0) toast.success("Đã hủy đơn hàng!");
      else toast.warning(res?.errMessage || "Không thể cập nhật trạng thái");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi hủy đơn hàng");
    }
  };

  // ✅ Mở modal trả hàng
  const openReturnModal = (order) => {
    const items =
      order.orderItems?.filter((i) => i.returnStatus === "none") || [];
    if (items.length === 0) {
      toast.info("Không có sản phẩm nào có thể trả trong đơn này.");
      return;
    }
    setCurrentOrder(order);
    setSelectedItems(items.map((i) => i.id));
    setReturnReason("");
    setShowReturnModal(true);
  };

  // ✅ Toggle chọn sản phẩm
  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // ✅ Gửi yêu cầu trả hàng
  const handleSubmitReturn = async () => {
    if (!returnReason.trim()) {
      toast.warning("Vui lòng nhập lý do trả hàng");
      return;
    }
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để trả");
      return;
    }

    try {
      setLoading(true);
      for (let itemId of selectedItems) {
        await requestReturn(itemId, returnReason);
      }
      toast.success("Đã gửi yêu cầu trả hàng!");
      fetchOrders();
      setShowReturnModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi yêu cầu trả hàng");
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Lọc đơn hàng (chỉ của user hiện tại)
  const filteredOrders = orders.filter(
    (order) =>
      (!filter || order.status === filter) &&
      (!user || order.userId === user.id)
  );

  // 🧮 Format
  const formatCurrency = (value) =>
    parseFloat(value || 0).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) =>
    new Date(dateStr || Date.now()).toLocaleDateString("vi-VN");

  return (
    <div className="order-page py-2">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="fw-bold text-primary">Đơn hàng của tôi</h2>
          <Form.Select
            className="w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            {Object.keys(statusLabels).map((key) => (
              <option key={key} value={key}>
                {statusLabels[key]}
              </option>
            ))}
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Table responsive bordered hover className="order-table align-middle">
            <thead className="text-center">
              <tr>
                <th>#</th>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Phương thức TT</th>
                <th>Trạng thái TT</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{`DH${order.id}`}</strong>
                    </td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      {paymentMethodLabels[order.paymentMethod] || "Không rõ"}
                    </td>
                    <td>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="d-flex justify-content-center gap-1 flex-wrap">
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
                          onClick={() => handleCancelOrder(order.id)}
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
        )}

        {/* 🧾 Modal trả hàng */}
        <Modal
          show={showReturnModal}
          onHide={() => setShowReturnModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Yêu cầu trả hàng</Modal.Title>
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

                <Form.Group>
                  <Form.Label>Chọn sản phẩm muốn trả</Form.Label>
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
                </Form.Group>
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
      </Container>
    </div>
  );
};

export default OrderPage;
