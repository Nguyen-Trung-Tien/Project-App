import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container,
  Button,
  Spinner,
  Badge,
  Modal,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import {
  Eye,
  Hourglass,
  CheckCircle,
  Gear,
  Truck,
  BoxSeam,
  XCircle,
  Box,
  ClockHistory,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getOrdersByUserId, updateOrderStatus } from "../../api/orderApi";
import AppPagination from "../../components/Pagination/Pagination";
import "./OrderPage.scss";
import { getImage } from "../../utils/decodeImage";

const STATUS_TABS = [
  { key: "pending", label: "Chờ xử lý" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipped", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];
const STATUS_ICONS = {
  pending: <Hourglass size={16} />,
  confirmed: <CheckCircle size={16} />,
  processing: <Gear size={16} />,
  shipped: <Truck size={16} />,
  delivered: <BoxSeam size={16} />,
  cancelled: <XCircle size={16} />,
};
const STATUS_COLORS = {
  pending: "#f0ad4e",
  confirmed: "#5bc0de",
  processing: "#0275d8",
  shipped: "#5a5a5a",
  delivered: "#5cb85c",
  cancelled: "#d9534f",
};
const statusVariants = {
  pending: "warning",
  confirmed: "info",
  processing: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

const statusLabels = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const paymentStatus = {
  unpaid: { label: "Chưa thanh toán", variant: "secondary" },
  paid: { label: "Đã thanh toán", variant: "success" },
  refunded: { label: "Đã hoàn tiền", variant: "info" },
};

const OrderPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [receivingId, setReceivingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const limit = 10;

  const productCounts = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      if (
        ["pending", "confirmed", "processing", "shipped"].includes(order.status)
      ) {
        counts[order.status] =
          (counts[order.status] || 0) + (order.orderItems?.length || 0);
      }
    });
    counts[""] = orders.reduce(
      (sum, o) => sum + (o.orderItems?.length || 0),
      0,
    );
    return counts;
  }, [orders]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOrdersByUserId(
        token,
        user.id,
        page,
        limit,
        activeTab,
      );
      if (res?.errCode === 0) {
        setOrders(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        toast.warning(res?.errMessage || "Không thể tải đơn hàng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, page, activeTab]);

  useEffect(() => {
    if (user?.id && token) {
      fetchOrders();
    }
  }, [fetchOrders, user?.id, token]);

  // Reset page khi đổi tab
  const handleTabSelect = (k) => {
    setActiveTab(k);
    setPage(1);
  };

  const filteredOrders = orders.filter(
    (o) => !activeTab || o.status === activeTab,
  );

  const handleReceiveOrder = async (id) => {
    setReceivingId(id);
    try {
      const res = await updateOrderStatus(id, "delivered");
      if (res?.errCode === 0) {
        toast.success("Đã nhận hàng!");
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      toast.error("Lỗi xác nhận nhận hàng");
    } finally {
      setReceivingId(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      const res = await updateOrderStatus(orderToCancel.id, "cancelled");
      if (res?.errCode === 0) {
        toast.success("Đã hủy đơn!");
        fetchOrders();
      }
    } catch {
      toast.error("Không thể hủy đơn");
    } finally {
      setShowCancelModal(false);
      setCancelling(false);
    }
  };

  const formatCurrency = (v) => (Number(v) || 0).toLocaleString("vi-VN") + " ₫";

  return (
    <Container className="py-3 order-page">
      <div className="order-header d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm rounded-3 bg-white">
        <div className="d-flex align-items-center">
          <Box className="order-header-icon me-2" size={28} />
          <h4 className="order-header-title mb-0 fw-bold">Đơn hàng của tôi</h4>
        </div>

        <Button
          size="sm"
          variant="outline-primary"
          className="order-history-btn d-flex align-items-center"
          onClick={() => navigate("/order-history")}
        >
          <ClockHistory className="me-1" /> Xem lịch sử
        </Button>
      </div>

      {/* TABS */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} justify>
        {STATUS_TABS.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: STATUS_COLORS[tab.key],
                  fontWeight: activeTab === tab.key ? "600" : "400",
                }}
              >
                {STATUS_ICONS[tab.key]}
                {tab.label}
                {["pending", "confirmed", "processing", "shipped"].includes(
                  tab.key,
                ) &&
                  productCounts[tab.key] > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-16px",
                        fontSize: "0.65rem",
                      }}
                    >
                      {productCounts[tab.key]}
                    </Badge>
                  )}
              </span>
            }
          />
        ))}
      </Tabs>

      {/* LIST ORDERS */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="orders-list mt-3">
          {filteredOrders.length ? (
            filteredOrders.map((o) => (
              <Card key={o.id} className="mb-3 shadow-sm">
                <Card.Body>
                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">{"Sản phẩm"}</div>
                    <div className="text-muted small">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  {o.orderItems?.map((i) => {
                    const p = i.product;
                    return (
                      <div key={i.id} className="d-flex gap-3 mb-2">
                        <img
                          src={getImage(p?.image) || "/images/no-image.png"}
                          alt={p?.name || i.productName}
                          width={60}
                          height={60}
                          className="rounded"
                        />
                        <div className="flex-grow-1">
                          <div
                            className="fw-semibold product-name"
                            onClick={() => navigate(`/orders-detail/${o.id}`)}
                          >
                            {p?.name || i.productName}
                          </div>
                          <div className="text-muted small">
                            SL: {i.quantity}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {p?.discount > 0 && (
                              <small className="text-decoration-line-through text-muted">
                                {formatCurrency(p.price)}
                              </small>
                            )}
                            <span className="fw-semibold text-danger">
                              {formatCurrency(i.price)}
                            </span>
                            {p?.discount > 0 && (
                              <Badge bg="danger">-{p.discount}%</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* FOOTER */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <Badge bg={statusVariants[o.status]} className="me-2">
                        {statusLabels[o.status]}
                      </Badge>
                      <Badge bg={paymentStatus[o.paymentStatus]?.variant}>
                        {paymentStatus[o.paymentStatus]?.label}
                      </Badge>
                    </div>
                    <div className="fw-bold text-success">
                      {formatCurrency(o.totalPrice)}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/orders-detail/${o.id}`)}
                    >
                      <Eye /> Chi tiết
                    </Button>
                    {o.status === "pending" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setOrderToCancel(o);
                          setShowCancelModal(true);
                        }}
                      >
                        Hủy đơn
                      </Button>
                    )}
                    {o.status === "shipped" && (
                      <Button
                        size="sm"
                        variant="success"
                        disabled={receivingId === o.id}
                        onClick={() => handleReceiveOrder(o.id)}
                      >
                        {receivingId === o.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Nhận hàng"
                        )}
                      </Button>
                    )}
                    {o.status === "delivered" && (
                      <>
                        <Button
                          size="sm"
                          className="btn-orange"
                          onClick={() =>
                            navigate(
                              `/product-detail/${o.orderItems[0]?.product?.id}`,
                            )
                          }
                        >
                          Đánh giá
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted py-5">Không có đơn hàng</div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-3 d-flex justify-content-center">
          <AppPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      )}

      {/* CANCEL MODAL */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn hủy đơn hàng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? <Spinner animation="border" size="sm" /> : "Hủy đơn"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderPage;
