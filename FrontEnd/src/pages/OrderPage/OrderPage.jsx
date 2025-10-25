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

const StatusBadge = ({ status }) => {
  let variant = "secondary";
  switch (status) {
    case "pending":
      variant = "warning";
      break;
    case "confirmed":
      variant = "info";
      break;
    case "processing":
    case "shipped":
      variant = "primary";
      break;
    case "delivered":
      variant = "success";
      break;
    case "cancelled":
      variant = "danger";
      break;
  }
  return <Badge bg={variant}>{statusLabels[status] || status}</Badge>;
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal trả hàng
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res?.errCode === 0 && Array.isArray(res?.data)) setOrders(res.data);
      else toast.warning(res?.errMessage || "Không thể tải đơn hàng");
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReceiveOrder = async (orderId) => {
    try {
      const res = await updateOrderStatus(orderId, "delivered");
      if (res?.errCode === 0) toast.success("Đơn hàng đã được nhận!");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi khi nhận hàng");
      console.error(error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await updateOrderStatus(orderId, "cancelled");
      if (res?.errCode === 0) toast.success("Đơn hàng đã hủy!");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi khi hủy đơn hàng");
      console.error(error);
    }
  };

  const openReturnModal = (orderId) => {
    setCurrentOrderId(orderId);
    const order = orders.find((o) => o.id === orderId);
    const itemsToReturn = order.orderItems
      .filter((i) => i.returnStatus === "none")
      .map((i) => i.id);
    setSelectedItems(itemsToReturn);
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
    if (!returnReason.trim()) {
      toast.warning("Vui lòng nhập lý do trả hàng");
      return;
    }
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để trả");
      return;
    }

    try {
      for (let itemId of selectedItems) {
        await requestReturn(itemId, returnReason);
      }
      toast.success("Yêu cầu trả hàng đã gửi!");
      fetchOrders();
      setShowReturnModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi yêu cầu trả hàng");
    }
  };

  const filteredOrders = orders.filter(
    (order) => !filter || order.status === filter
  );

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

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
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Table responsive bordered hover className="order-table">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id} className="align-middle text-center">
                    <td>{idx + 1}</td>
                    <td>
                      <strong> {`DH${order.id}`}</strong>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>
                      <StatusBadge status={order.status} />
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

                      {order.orderItems?.some(
                        (item) => item.returnStatus === "none"
                      ) &&
                        order.status === "delivered" && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => openReturnModal(order.id)}
                          >
                            Yêu cầu trả hàng
                          </Button>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        <Modal
          show={showReturnModal}
          onHide={() => setShowReturnModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Yêu cầu trả hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentOrderId && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Lý do trả hàng</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Chọn sản phẩm muốn trả</Form.Label>
                  {orders
                    .find((o) => o.id === currentOrderId)
                    .orderItems.filter((i) => i.returnStatus === "none")
                    .map((item) => (
                      <Form.Check
                        type="checkbox"
                        key={item.id}
                        label={`${item.productName} (Mã: ${item.id})`}
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
              Hủy
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
