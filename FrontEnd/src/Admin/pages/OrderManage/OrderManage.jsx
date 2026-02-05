import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  Button,
  Badge,
  Dropdown,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Pagination,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";
import {
  BoxSeamFill,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  Truck,
  CheckCircleFill,
  XCircleFill,
  ArrowCounterclockwise,
  CurrencyDollar,
  PersonFill,
  Calendar3,
  GeoAltFill,
  InfoCircle,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../api/orderApi";
import { updatePayment } from "../../../api/paymentApi";
import "./OrderManage.scss";
import {
  paymentStatusMap,
  returnStatusMap,
  statusMap,
} from "../../../utils/StatusMap";
import { StatusBadge } from "../../../utils/StatusBadge";
import AppPagination from "../../../components/Pagination/Pagination";

const OrderManage = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const searchTimeoutRef = useRef(null);
  const tableTopRef = useRef(null);
  const openDeleteModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDelete(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrderId(null);
    setShowDelete(false);
  };
  const fetchOrders = useCallback(
    async (currentPage = 1, search = "") => {
      setLoading(true);
      try {
        const res = await getAllOrders(
          currentPage,
          limit,
          search.trim(),
          token,
        );
        if (res?.errCode === 0) {
          setOrders(res.data || []);
          setPage(res.pagination?.currentPage || currentPage);
          setTotalPages(res.pagination?.totalPages || 1);
        } else {
          toast.error(res?.errMessage || "Lỗi tải đơn hàng");
          setOrders([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi kết nối server");
        setOrders([]);
      } finally {
        setLoading(false);
        tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [token, limit],
  );

  useEffect(() => {
    fetchOrders(1, searchTerm);
  }, [fetchOrders, searchTerm]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchOrders(1, searchTerm);
    }, 600);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm, fetchOrders]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoadingId(orderId);
      const res = await updateOrderStatus(orderId, status, token);

      if (res?.errCode === 0) {
        toast.success(`Cập nhật: ${statusMap[status]?.label}`);
        await fetchOrders(page, searchTerm);

        const order = orders.find((o) => o.id === orderId);
        const method = order.paymentMethod?.toLowerCase();
        const isOnlineMethod = ["momo", "paypal", "vnpay", "bank"].includes(
          method,
        );

        if (
          status === "cancelled" &&
          isOnlineMethod &&
          order.paymentStatus === "paid"
        ) {
          try {
            const refundRes = await updatePayment(
              orderId,
              {
                paymentStatus: "refunded",
              },
              token,
            );
            if (refundRes?.errCode === 0) {
              toast.success(`Đơn ${orderId} đã hoàn tiền!`);
              await fetchOrders(page, searchTerm);
            } else {
              toast.warn(refundRes?.errMessage || "Hoàn tiền thất bại");
            }
          } catch (refundErr) {
            console.log(refundErr);
            toast.error("Lỗi hoàn tiền");
          }
        }
      } else {
        toast.error(res?.errMessage);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi cập nhật");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;

    try {
      setLoadingId(selectedOrderId);

      const res = await deleteOrder(selectedOrderId, token);

      if (res?.errCode === 0) {
        toast.success(`Đã xóa đơn DH${selectedOrderId}!`);
        await fetchOrders(page, searchTerm);
      } else {
        toast.error(res?.errMessage || "Xóa đơn thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối khi xóa đơn");
    } finally {
      setLoadingId(null);
      closeDeleteModal();
    }
  };

  const handleUpdatePaymentStatus = async (order, status) => {
    if (!user || user.role !== "admin") {
      toast.warning("Chỉ Admin được cập nhật!");
      return;
    }

    const method = order.paymentMethod?.toLowerCase();
    const canUpdate =
      method === "cod" ||
      (["momo", "paypal", "vnpay", "bank"].includes(method) &&
        order.status === "cancelled");

    if (!canUpdate) {
      toast.info("Chỉ cập nhật được COD hoặc đơn hủy online!");
      return;
    }

    try {
      setLoadingId(order.id);
      const res = await updatePayment(
        order.id,
        { paymentStatus: status },
        token,
      );
      if (res?.errCode === 0) {
        toast.success(`Thanh toán: ${paymentStatusMap[status]?.label}`);
        await fetchOrders(page, searchTerm);
      } else {
        toast.error(res?.errMessage);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi cập nhật thanh toán");
    } finally {
      setLoadingId(null);
    }
  };

  const formatCurrency = (v) =>
    v ? Number(v).toLocaleString("vi-VN") + " ₫" : "0 ₫";
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");
  const paidMethods = ["momo", "paypal", "vnpay", "bank", "transfer"];

  return (
    <div className="order-manage">
      <h3 className="mb-4">
        <BoxSeamFill className="me-2" /> Quản lý đơn hàng
      </h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm theo mã, tên, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="primary" className="fs-6">
                Tổng: {orders.length} đơn
              </Badge>
            </Col>
          </Row>

          <div ref={tableTopRef}>
            <Table
              striped
              bordered
              hover
              responsive
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>Mã</th>
                  <th>
                    <PersonFill className="me-1" />
                    Khách
                  </th>
                  <th>SĐT</th>
                  <th>
                    <GeoAltFill className="me-1" />
                    Địa chỉ
                  </th>
                  <th>
                    <Calendar3 className="me-1" />
                    Ngày
                  </th>

                  <th>Sản phẩm</th>
                  <th>
                    <CurrencyDollar className="me-1" />
                    Tổng
                  </th>
                  <th>TT</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center text-muted py-4">
                      Không có đơn hàng
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>DH{order.id}</strong>
                      </td>
                      <td className="text-start">
                        {order.user?.username || "—"}
                      </td>
                      <td>{order.user?.phone || "—"}</td>
                      <td className="text-start">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{order.shippingAddress}</Tooltip>}
                        >
                          <div
                            className="text-truncate"
                            style={{ maxWidth: 180 }}
                          >
                            {order.shippingAddress || "—"}
                          </div>
                        </OverlayTrigger>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="text-start">
                        {order.orderItems?.length > 0 ? (
                          order.orderItems.map((item, idx) => (
                            <div key={idx} className="small mb-1">
                              <strong>{item.productName}</strong> x
                              {item.quantity}
                              {item.returnStatus !== "none" && (
                                <Badge bg="warning" className="ms-1">
                                  {returnStatusMap[item.returnStatus]?.label}
                                </Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="fw-bold text-danger">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td>
                        <Badge
                          bg={
                            paidMethods.includes(
                              order.paymentMethod?.toLowerCase(),
                            )
                              ? "success"
                              : "warning"
                          }
                        >
                          {order.paymentMethod?.toUpperCase() || "COD"}
                        </Badge>
                      </td>
                      <td>
                        <StatusBadge map={statusMap} status={order.status} />
                      </td>
                      <td>
                        {paidMethods.includes(
                          order.paymentMethod?.toLowerCase(),
                        ) ? (
                          <Badge bg="success">
                            <CheckCircleFill className="me-1" />
                            Đã TT
                          </Badge>
                        ) : order.paymentStatus === "paid" ? (
                          <Badge bg="success">
                            <CheckCircleFill className="me-1" />
                            Đã TT
                          </Badge>
                        ) : order.paymentStatus === "refunded" ? (
                          <Badge bg="info">
                            <ArrowCounterclockwise className="me-1" />
                            Hoàn
                          </Badge>
                        ) : (
                          <Badge bg="secondary">
                            <XCircleFill className="me-1" />
                            Chưa
                          </Badge>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-primary"
                              size="sm"
                              disabled={loadingId === order.id}
                            >
                              {loadingId === order.id ? (
                                <Spinner size="sm" />
                              ) : (
                                "Cập nhật"
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.keys(statusMap).map((key) => (
                                <Dropdown.Item
                                  key={key}
                                  onClick={() =>
                                    handleUpdateStatus(order.id, key)
                                  }
                                  className={
                                    key === "cancelled" ? "text-danger" : ""
                                  }
                                >
                                  {statusMap[key].label}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>

                          {user?.role === "admin" && (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-success"
                                size="sm"
                                disabled={loadingId === order.id}
                              >
                                {order.paymentMethod?.toUpperCase()}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {(() => {
                                  const method =
                                    order.paymentMethod?.toLowerCase();
                                  if (method === "cod") {
                                    return Object.keys(paymentStatusMap).map(
                                      (key) => (
                                        <Dropdown.Item
                                          key={key}
                                          onClick={() =>
                                            handleUpdatePaymentStatus(
                                              order,
                                              key,
                                            )
                                          }
                                        >
                                          {paymentStatusMap[key].label}
                                        </Dropdown.Item>
                                      ),
                                    );
                                  }
                                  if (
                                    [
                                      "momo",
                                      "paypal",
                                      "vnpay",
                                      "bank",
                                    ].includes(method) &&
                                    order.status === "cancelled"
                                  ) {
                                    return ["unpaid", "refunded"].map((key) => (
                                      <Dropdown.Item
                                        key={key}
                                        onClick={() =>
                                          handleUpdatePaymentStatus(order, key)
                                        }
                                      >
                                        {paymentStatusMap[key].label}
                                      </Dropdown.Item>
                                    ));
                                  }
                                  return null;
                                })()}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}

                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() =>
                              navigate(`/orders-detail/${order.id}`)
                            }
                          >
                            <InfoCircle /> Chi tiết
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => openDeleteModal(order.id)}
                          >
                            <XCircleFill className="me-1" />
                            Xóa
                          </Button>
                          {order.orderItems?.some(
                            (i) => i.returnStatus === "requested",
                          ) && (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                navigate(`/admin/orders-return/${order.id}`)
                              }
                            >
                              <ExclamationTriangleFill /> Trả hàng
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <AppPagination
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={(p) => fetchOrders(p, searchTerm)}
          />
        </Card.Body>
      </Card>
      <Modal show={showDelete} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá đơn hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Bạn có chắc chắn muốn xóa đơn <strong>DH{selectedOrderId}</strong>?
          <br />
          <span className="text-danger">
            Hành động này không thể khôi phục!
          </span>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Hủy
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteOrder}
            disabled={loadingId === selectedOrderId}
          >
            {loadingId === selectedOrderId ? <Spinner size="sm" /> : "Xóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManage;
