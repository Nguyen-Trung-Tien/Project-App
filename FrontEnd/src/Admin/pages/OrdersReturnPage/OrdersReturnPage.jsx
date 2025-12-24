import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Modal,
  Card,
  Spinner,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import {
  ArrowLeft,
  CheckCircleFill,
  XCircleFill,
  ExclamationTriangleFill,
  Calendar3,
  PersonFill,
  CurrencyDollar,
  Truck,
  InfoCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";
import { getAllOrders } from "../../../api/orderApi";
import "./OrdersReturnPage.scss";
import { processReturn } from "../../../api/orderItemApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OrdersReturnPage = () => {
  const token = useSelector((state) => state.user.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const tableTopRef = useRef(null);

  const fetchOrders = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await getAllOrders(currentPage, limit);
      if (res.errCode === 0) {
        const allOrders = res.data || [];

        const filteredOrders = allOrders.filter((order) =>
          order.orderItems?.some((item) => item.returnStatus === "requested")
        );

        setOrders(filteredOrders);

        const totalFiltered = filteredOrders.length;
        const calculatedTotalPages = Math.ceil(totalFiltered / limit) || 1;

        setTotalPages(calculatedTotalPages);

        if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
          setPage(calculatedTotalPages);
          setTimeout(() => fetchOrders(calculatedTotalPages), 0);
        } else {
          setPage(currentPage);
        }
      } else {
        toast.error(res.errMessage || "Lỗi tải dữ liệu");
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server");
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    fetchOrders(newPage);
  };

  const handleProcessReturn = async (orderId, status) => {
    if (!selectedOrder) return;
    setLoadingAction(true);
    try {
      const itemsToProcess = selectedOrder.orderItems.filter(
        (i) => i.returnStatus === "requested"
      );

      for (let item of itemsToProcess) {
        await processReturn(item.id, status, token);
      }

      toast.success(
        status === "approved"
          ? "Đã duyệt trả hàng!"
          : "Đã từ chối yêu cầu trả hàng!"
      );

      await fetchOrders(page);
      setModalShow(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi xử lý trả hàng");
    } finally {
      setLoadingAction(false);
    }
  };

  const formatCurrency = (value) =>
    value ? Number(value).toLocaleString("vi-VN") + " ₫" : "0 ₫";

  const renderPagination = () => {
    if (orders.length === 0 || totalPages <= 1) return null;

    const items = [];
    const pageNeighbours = 1;
    const startPage = Math.max(1, page - pageNeighbours);
    const endPage = Math.min(totalPages, page + pageNeighbours);

    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)}>
          <ChevronDoubleLeft />
        </Pagination.First>
      );
    }

    if (page > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(page - 1)}>
          <ChevronLeft />
        </Pagination.Prev>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (page < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(page + 1)}>
          <ChevronRight />
        </Pagination.Next>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        >
          <ChevronDoubleRight />
        </Pagination.Last>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">{items}</Pagination>
    );
  };

  return (
    <Container className="py-4 order-return-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="m-0">
          <Truck className="me-2" /> Quản lý trả hàng
        </h3>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/admin/orders")}
          className="d-flex align-items-center gap-1"
        >
          <ArrowLeft /> Quay lại
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col className="text-end">
              <Badge bg="warning" className="fs-6">
                {orders.length} yêu cầu trả hàng
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
                  <th>Mã đơn</th>
                  <th>
                    <PersonFill className="me-1" /> Khách hàng
                  </th>
                  <th>
                    <Calendar3 className="me-1" /> Ngày đặt
                  </th>
                  <th>
                    <CurrencyDollar className="me-1" /> Tổng tiền
                  </th>
                  <th>Trạng thái</th>
                  <th>
                    <ExclamationTriangleFill className="me-1" /> Yêu cầu
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Không có yêu cầu trả hàng
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
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="fw-bold text-danger">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td>
                        <Badge
                          bg={
                            order.status === "delivered"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg="warning"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: 90 }}
                        >
                          <ExclamationTriangleFill className="me-1" size={12} />
                          Đã yêu cầu
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalShow(true);
                          }}
                          className="d-flex align-items-center gap-1"
                        >
                          <InfoCircle /> Xử lý
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Truck className="text-warning" /> Xử lý trả hàng - Mã đơn DH
            {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="mb-3">
                <strong>Khách hàng:</strong> {selectedOrder.user?.username} |{" "}
                <strong>SĐT:</strong> {selectedOrder.user?.phone}
              </div>
              <Table striped bordered hover responsive>
                <thead className="table-secondary">
                  <tr>
                    <th>Mã SP</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Lý do trả hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems
                    .filter((i) => i.returnStatus === "requested")
                    .map((item) => (
                      <tr key={item.id}>
                        <td>#{item.productId}</td>
                        <td className="text-start">{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td
                          className="text-start"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "250px",
                          }}
                          title={item.returnReason}
                        >
                          {item.returnReason || "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => handleProcessReturn(selectedOrder?.id, "approved")}
            disabled={loadingAction}
            className="d-flex align-items-center gap-1"
          >
            {loadingAction ? (
              <>
                <Spinner animation="border" size="sm" /> Đang duyệt...
              </>
            ) : (
              <>
                <CheckCircleFill /> Duyệt trả hàng
              </>
            )}
          </Button>
          <Button
            variant="danger"
            onClick={() => handleProcessReturn(selectedOrder?.id, "rejected")}
            disabled={loadingAction}
            className="d-flex align-items-center gap-1"
          >
            {loadingAction ? (
              <>
                <Spinner animation="border" size="sm" /> Đang từ chối...
              </>
            ) : (
              <>
                <XCircleFill /> Từ chối
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalShow(false)}
            disabled={loadingAction}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersReturnPage;
