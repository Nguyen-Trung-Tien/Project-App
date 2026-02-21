import React, { useCallback, useEffect, useReducer } from "react";
import {
  Container,
  Row,
  Col,
  ProgressBar,
  Button,
  Card,
  Spinner,
  Form,
  Modal,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getOrderById } from "../../api/orderApi";
import { requestReturn } from "../../api/orderItemApi";
import { getImage } from "../../utils/decodeImage";
import { StatusBadge } from "../../utils/StatusBadge";
import { paymentStatusMap, returnStatusMap, statusMap } from "../../utils/StatusMap";
import "./OrderDetail.scss";

const Info = ({ label, value }) => (
  <div className="info-row">
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

const initialState = {
  order: null,
  loading: false,
  showReturnModal: false,
  selectedItems: [],
  returnReason: "",
  submitting: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload };
    case "OPEN_RETURN_MODAL":
      return {
        ...state,
        showReturnModal: true,
        selectedItems: action.payload,
        returnReason: "",
      };
    case "CLOSE_RETURN_MODAL":
      return { ...state, showReturnModal: false };
    case "TOGGLE_ITEM":
      return {
        ...state,
        selectedItems: state.selectedItems.includes(action.payload)
          ? state.selectedItems.filter((id) => id !== action.payload)
          : [...state.selectedItems, action.payload],
      };
    case "SET_RETURN_REASON":
      return { ...state, returnReason: action.payload };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    default:
      return state;
  }
};

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
    case "cancelled":
      return 100;
    default:
      return 0;
  }
};

const HeaderCard = ({ order }) => (
  <Card className="order-header mb-4 shadow-sm border-0">
    <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h4 className="fw-bold mb-1">
          Đơn hàng <span className="text-primary">#DH{order.id}</span>
        </h4>
        <h6 className="fw-bold mb-1">
          Mã thanh toán <span className="text-primary">#DH{order.orderCode}</span>
        </h6>
        <div className="d-flex align-items-center gap-2">
          <StatusBadge map={statusMap} status={order.status} />
          <StatusBadge map={paymentStatusMap} status={order.paymentStatus} />
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
);

const InfoCards = ({ order }) => (
  <Row className="mb-4 g-3">
    <Col md={6}>
      <Card className="info-card shadow-sm border-0 h-100">
        <Card.Body>
          <h6 className="section-title">Người nhận</h6>
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
          <h6 className="section-title">Thanh toán</h6>
          <Info
            label="Ngày đặt"
            value={new Date(order.orderDate || order.createdAt).toLocaleDateString("vi-VN")}
          />
          {order.deliveredAt && (
            <Info
              label="Ngày giao"
              value={new Date(order.deliveredAt).toLocaleDateString("vi-VN")}
            />
          )}
          <Info label="Phương thức" value={order.paymentMethod?.toUpperCase()} />
          <Info label="Mã thanh toán" value={order.orderCode} />
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
);

const ProductList = ({ items }) => (
  <>
    <h5 className="fw-semibold mb-3">Sản phẩm</h5>
    <div className="product-list">
      {items?.map((item) => {
        const product = item.product || {};
        const subtotal = item.price * item.quantity;

        return (
          <Card key={item.id} className="product-card shadow-sm border-0">
            <Card.Body className="d-flex gap-3">
              <img src={getImage(product.image)} alt={product.name} className="product-img" />

              <div className="flex-grow-1">
                <Link to={`/product-detail/${product.id}`} className="product-name">
                  {product.name || item.productName}
                </Link>

                <div className="text-muted small mt-1">
                  SL: {item.quantity} | Giá: {item.price.toLocaleString()} ₫
                </div>

                <div className="mt-2">
                  <StatusBadge map={returnStatusMap} status={item.returnStatus} />
                  {item.returnReason && (
                    <div className="small text-muted mt-1">Lý do: {item.returnReason}</div>
                  )}
                </div>
              </div>

              <div className="text-end fw-bold">{subtotal.toLocaleString()} ₫</div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  </>
);

const ReturnModal = ({
  show,
  onClose,
  orderItems,
  selectedItems,
  returnReason,
  submitting,
  onToggleItem,
  onReasonChange,
  onSubmit,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Yêu cầu trả hàng</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Lý do</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={returnReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Nhập lý do trả hàng..."
        />
      </Form.Group>

      <Form.Label>Chọn sản phẩm muốn trả</Form.Label>
      <div className="border rounded p-2">
        {orderItems
          ?.filter((item) => item.returnStatus === "none")
          .map((item) => (
            <Form.Check
              key={item.id}
              type="checkbox"
              label={`${item.productName} (SL: ${item.quantity})`}
              checked={selectedItems.includes(item.id)}
              onChange={() => onToggleItem(item.id)}
            />
          ))}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Đóng
      </Button>
      <Button variant="primary" onClick={onSubmit} disabled={submitting}>
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
);

const OrderDetail = () => {
  const token = useSelector((state) => state.user.token);
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { order, loading, showReturnModal, selectedItems, returnReason, submitting } = state;

  const fetchOrderDetail = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await getOrderById(id, token);

      if (res.errCode === 0) {
        dispatch({ type: "SET_ORDER", payload: res.data });
      } else if (res.errCode === 2) {
        toast.error("Bạn không có quyền xem đơn hàng này");
      } else {
        toast.error(res.errMessage);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không được phép xem đơn hàng này");
      } else {
        toast.error("Lỗi tải đơn hàng");
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const openReturnModal = () => {
    if (order.status !== "delivered") {
      toast.warning("Chỉ có thể trả hàng khi đơn đã giao");
      return;
    }

    const items = order.orderItems?.filter((item) => item.returnStatus === "none") || [];
    if (!items.length) {
      toast.info("Không có sản phẩm có thể trả trong đơn này");
      return;
    }

    dispatch({
      type: "OPEN_RETURN_MODAL",
      payload: items.map((item) => item.id),
    });
  };

  const handleSubmitReturn = async () => {
    if (submitting) return;
    if (!returnReason.trim()) {
      toast.warning("Vui lòng nhập lý do trả hàng");
      return;
    }
    if (!selectedItems.length) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      await Promise.all(
        selectedItems.map((itemId) =>
          requestReturn(itemId, returnReason, token).catch((err) => {
            console.error(`Lỗi gửi yêu cầu trả hàng cho item ${itemId}:`, err);
            throw err;
          }),
        ),
      );

      toast.success("Gửi yêu cầu trả hàng thành công");
      dispatch({ type: "CLOSE_RETURN_MODAL" });
      fetchOrderDetail();
    } catch {
      toast.error("Một số sản phẩm không thể trả. Vui lòng thử lại.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-5">Không có dữ liệu đơn hàng</p>;
  }

  return (
    <div className="order-detail-page py-3">
      <Container>
        <div className="order-title">
          <span className="order-title__icon">🧾</span>
          <div>
            <h3 className="order-title__text">
              Chi tiết đơn hàng
              <span className="order-title__id">#DH{order.id}</span>
            </h3>
            <p className="order-title__sub">Theo dõi trạng thái và thông tin đơn hàng</p>
          </div>
        </div>

        <HeaderCard order={order} />
        <InfoCards order={order} />
        <ProductList items={order.orderItems} />

        {order.status === "delivered" &&
          order.orderItems?.some((item) => item.returnStatus === "none") && (
            <div className="text-end mt-4">
              <Button variant="warning" size="lg" onClick={openReturnModal}>
                Yêu cầu trả hàng
              </Button>
            </div>
          )}

        <ReturnModal
          show={showReturnModal}
          onClose={() => dispatch({ type: "CLOSE_RETURN_MODAL" })}
          orderItems={order.orderItems}
          selectedItems={selectedItems}
          returnReason={returnReason}
          submitting={submitting}
          onToggleItem={(itemId) => dispatch({ type: "TOGGLE_ITEM", payload: itemId })}
          onReasonChange={(value) => dispatch({ type: "SET_RETURN_REASON", payload: value })}
          onSubmit={handleSubmitReturn}
        />
      </Container>
    </div>
  );
};

export default OrderDetail;
