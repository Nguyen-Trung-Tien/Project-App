import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Badge,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Cart4, Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getOrdersByUserId, updateOrderStatus } from "../../api/orderApi";
import AppPagination from "../../components/Pagination/Pagination";
import "./OrderPage.scss";

const STATUS_TABS = [
  { key: "pending", label: "Chờ xử lý" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipped", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "", label: "Tất cả" },
  { key: "cancelled", label: "Đã hủy" },
];

const statusVariants = {
  pending: "warning",
  confirmed: "info",
  processing: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

const paymentStatus = {
  unpaid: { label: "Chưa thanh toán", variant: "secondary" },
  paid: { label: "Đã thanh toán", variant: "success" },
  refunded: { label: "Đã hoàn tiền", variant: "info" },
};

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const limit = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await getOrdersByUserId(
        token,
        user.id,
        page,
        limit,
        activeTab
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
  };

  useEffect(() => {
    if (user?.id && token) {
      fetchOrders();
    }
  }, [page, activeTab, user?.id, token]);

  const filteredOrders = orders.filter(
    (o) => !activeTab || o.status === activeTab
  );

  const handleReceiveOrder = async (id) => {
    try {
      const res = await updateOrderStatus(id, "delivered");
      if (res?.errCode === 0) toast.success("Đã nhận hàng!");
      fetchOrders();
    } catch {
      toast.error("Lỗi xác nhận nhận hàng");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await updateOrderStatus(orderToCancel.id, "cancelled");
      if (res?.errCode === 0) toast.success("Đã hủy đơn!");
      fetchOrders();
    } catch {
      toast.error("Không thể hủy đơn");
    } finally {
      setShowCancelModal(false);
    }
  };

  const formatCurrency = (v) =>
    parseFloat(v || 0).toLocaleString("vi-VN") + " ₫";

  return (
    <Container className="py-3 order-page">
      {/* TITLE */}
      <div className="text-center mb-3">
        <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill order-title">
          <Cart4 size={26} className="me-2" />
          <h4 className="fw-bold mb-0">Đơn hàng của tôi</h4>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setPage(1);
        }}
        className="mb-3"
        justify
      >
        {STATUS_TABS.map((tab) => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.label} />
        ))}
      </Tabs>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive shadow rounded">
          <Table bordered hover className="text-center align-middle mb-0">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length ? (
                filteredOrders.map((o, idx) => (
                  <tr key={o.id}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td className="fw-bold text-primary">{`DH${o.id}`}</td>
                    <td>{new Date(o.orderDate).toLocaleDateString("vi-VN")}</td>
                    <td className="text-start">
                      {o.orderItems?.map((i) => (
                        <div key={i.id}>
                          <div className="fw-semibold">{i.productName}</div>
                          <small className="text-muted">
                            {i.quantity} ×{" "}
                            {parseFloat(i.price).toLocaleString("vi-VN")} ₫
                          </small>
                        </div>
                      ))}
                    </td>
                    <td className="fw-semibold text-success">
                      {formatCurrency(o.totalPrice)}
                    </td>
                    <td>
                      <Badge bg={statusVariants[o.status]}>{o.status}</Badge>
                    </td>
                    <td>
                      <Badge bg={paymentStatus[o.paymentStatus]?.variant}>
                        {paymentStatus[o.paymentStatus]?.label}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2 justify-content-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => navigate(`/orders-detail/${o.id}`)}
                      >
                        <Eye /> Xem
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
                          Hủy
                        </Button>
                      )}

                      {o.status === "shipped" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleReceiveOrder(o.id)}
                        >
                          Nhận hàng
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-muted py-4">
                    Không có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
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
          <Modal.Title>⚠️ Hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn hủy đơn{" "}
          <strong>{orderToCancel && `DH${orderToCancel.id}`}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Không
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderPage;
