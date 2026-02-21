import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrdersByUserId } from "../../api/orderApi";
import AppPagination from "../../components/Pagination/Pagination";
import { getImage } from "../../utils/decodeImage";
import { paymentStatusMap, statusMap } from "../../utils/StatusMap";
import { StatusBadge } from "../../utils/StatusBadge";
import ClickableText from "../../components/ClickableText/ClickableText";
import "./OrderHistory.scss";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    if (!user?.id || !token) return;
    try {
      setLoading(true);
      const res = await getOrdersByUserId(token, user.id, page, limit);
      if (res?.errCode === 0) {
        setOrders(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatCurrency = (v) => (Number(v) || 0).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-";

  const filteredOrders = orders;

  return (
    <Container className="py-3 order-history-page">
      <div className="order-history-header text-center mb-4 py-3 px-2 shadow-sm rounded-3 bg-white">
        <h3 className="mb-0 fw-bold d-flex justify-content-center align-items-center gap-2">
          <span className="header-icon">🧾</span>
          Lịch sử đơn hàng
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-muted py-5">Bạn chưa có đơn hàng nào.</div>
      ) : (
        filteredOrders.map((o) => (
          <Card key={o.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-bold">Sản phẩm</div>
                <div className="text-muted small">{formatDate(o.createdAt)}</div>
              </div>

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
                      <ClickableText
                        className="fw-semibold product-name"
                        onClick={() => navigate(`/orders-detail/${o.id}`)}
                      >
                        {p?.name || i.productName}
                      </ClickableText>
                      <div className="text-muted small">SL: {i.quantity}</div>
                      <div className="d-flex align-items-center gap-2">
                        {p?.discount > 0 && (
                          <small className="text-decoration-line-through text-muted">
                            {formatCurrency(p.price)}
                          </small>
                        )}
                        <span className="fw-semibold text-danger">{formatCurrency(i.price)}</span>
                        {p?.discount > 0 && <Badge bg="danger">-{p.discount}%</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="me-2">
                    <StatusBadge map={statusMap} status={o.status} />
                  </span>
                  <StatusBadge map={paymentStatusMap} status={o.paymentStatus} />
                </div>
                <div className="fw-bold text-success">{formatCurrency(o.totalPrice)}</div>
              </div>

              <div className="d-flex gap-2 mt-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => navigate(`/orders-detail/${o.id}`)}
                >
                  <Eye className="me-1" /> Chi tiết
                </Button>
                {o.status === "delivered" && (
                  <Button
                    size="sm"
                    className="btn-primary"
                    onClick={() => navigate(`/product-detail/${o.orderItems[0]?.product?.id}`)}
                  >
                    Đánh giá
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}

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
    </Container>
  );
};

export default OrderHistoryPage;
