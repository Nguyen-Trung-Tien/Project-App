import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Tooltip,
  OverlayTrigger,
  Pagination,
  Spinner,
  Form,
} from "react-bootstrap";
import {
  ArrowLeft,
  CheckCircleFill,
  Trash3,
  ExclamationTriangleFill,
  Calendar3,
  PersonFill,
  CurrencyDollar,
  InfoCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";

import {
  getAllPayments,
  deletePayment,
  completePayment,
  refundPayment,
} from "../../../api/paymentApi";

import "./PaymentPage.scss";
import { toast } from "react-toastify";

const STATUS_LABELS = {
  pending: { text: "Chờ xử lý", class: "status-pending" },
  completed: { text: "Đã thanh toán", class: "status-completed" },
  failed: { text: "Thất bại", class: "status-failed" },
  refunded: { text: "Đã hoàn tiền", class: "status-refunded" },
};

const METHOD_BADGE = {
  vnpay: "bg-primary",
  momo: "bg-danger",
  cod: "bg-warning text-dark",
  bank: "bg-info text-dark",
};

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionModal, setActionModal] = useState({
    show: false,
    actionFn: null,
    paymentId: null,
    message: "",
  });

  const loadPayments = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await getAllPayments({
          status: filterStatus,
          page,
          limit: pageSize,
          search: searchTerm,
        });

        if (res.errCode === 0) {
          setPayments(res.data || []);
          setCurrentPage(res.pagination.currentPage);
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalItems);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, pageSize, searchTerm]
  );

  useEffect(() => {
    loadPayments(1);
  }, [loadPayments]);

  const handleActionClick = (actionFn, paymentId, message) => {
    setActionModal({
      show: true,
      actionFn,
      paymentId,
      message,
    });
  };

  const confirmAction = async () => {
    if (!actionModal.actionFn) return;

    const actionName =
      actionModal.actionFn === completePayment
        ? "Hoàn tất thanh toán"
        : actionModal.actionFn === refundPayment
        ? "Hoàn tiền"
        : actionModal.actionFn === deletePayment
        ? "Xóa giao dịch"
        : "Thao tác";

    try {
      if (actionModal.actionFn === refundPayment) {
        await actionModal.actionFn(actionModal.paymentId, refundNote);
        setRefundNote("");
      } else {
        await actionModal.actionFn(actionModal.paymentId);
      }
      loadPayments(currentPage);
      toast.success(`${actionName} thành công.`);
    } catch (error) {
      toast.error(`${actionName} thất bại. Vui lòng thử lại.`);
      console.error(error);
    } finally {
      setActionModal({
        show: false,
        actionFn: null,
        paymentId: null,
        message: "",
      });
    }
  };

  const renderActionButton = (payment) => (
    <div className="action-buttons d-flex gap-1 justify-content-center">
      <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => setSelectedPayment(payment)}
        >
          <InfoCircle />
        </Button>
      </OverlayTrigger>

      {payment.status === "pending" && (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Hoàn tất thanh toán</Tooltip>}
        >
          <Button
            size="sm"
            variant="outline-success"
            onClick={() =>
              handleActionClick(
                completePayment,
                payment.id,
                "Xác nhận đã nhận thanh toán?"
              )
            }
          >
            <CheckCircleFill />
          </Button>
        </OverlayTrigger>
      )}

      {payment.status === "completed" && (
        <OverlayTrigger placement="top" overlay={<Tooltip>Hoàn tiền</Tooltip>}>
          <Button
            size="sm"
            variant="warning"
            onClick={() =>
              handleActionClick(
                refundPayment,
                payment.id,
                "Bạn có chắc muốn hoàn tiền giao dịch này?"
              )
            }
          >
            <ArrowLeft />
          </Button>
        </OverlayTrigger>
      )}

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Xóa giao dịch</Tooltip>}
      >
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() =>
            handleActionClick(
              deletePayment,
              payment.id,
              "Bạn có chắc muốn xóa vĩnh viễn giao dịch này?"
            )
          }
        >
          <Trash3 size={14} />
        </Button>
      </OverlayTrigger>
    </div>
  );

  return (
    <div className="payment-page container py-3">
      <div className="page-header mb-4">
        <h3 className="page-title">
          <CurrencyDollar className="me-2" />
          Quản Lý Thanh Toán
        </h3>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="completed">Đã thanh toán</option>
          <option value="failed">Thất bại</option>
          <option value="refunded">Đã hoàn tiền</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Tìm kiếm ID, Order, User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadPayments(1)}
        />

        <Form.Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </Form.Select>

        <Button onClick={() => loadPayments(1)}>Áp dụng</Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {/* Table */}
          <Table hover responsive className="shadow-sm rounded">
            <thead className="table-primary text-white">
              <tr>
                <th>ID</th>
                <th>Đơn hàng</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <a href={`/orders-detail/${p.orderId}`}>#DH{p.orderId}</a>
                    </td>
                    <td>
                      <PersonFill className="me-1" />
                      {p.user?.username || "—"}
                      <br />
                      <small className="text-muted">
                        {p.user?.email || "—"}
                      </small>
                    </td>
                    <td className="text-success fw-bold">
                      {Number(p.amount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          METHOD_BADGE[p.method] || "bg-secondary"
                        }`}
                      >
                        {p.method?.toUpperCase() || "—"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          STATUS_LABELS[p.status]?.class || "bg-dark"
                        }`}
                      >
                        {STATUS_LABELS[p.status]?.text || p.status}
                      </span>
                    </td>
                    <td>
                      <Calendar3 className="me-1" />
                      {new Date(p.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="text-center">{renderActionButton(p)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
              <div>
                Trang {currentPage} / {totalPages} - Tổng {totalItems} giao dịch
              </div>
              <Pagination>
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => loadPayments(1)}
                >
                  <ChevronDoubleLeft />
                </Pagination.First>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => loadPayments(currentPage - 1)}
                >
                  <ChevronLeft />
                </Pagination.Prev>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i}
                    active={currentPage === i + 1}
                    onClick={() => loadPayments(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => loadPayments(currentPage + 1)}
                >
                  <ChevronRight />
                </Pagination.Next>
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => loadPayments(totalPages)}
                >
                  <ChevronDoubleRight />
                </Pagination.Last>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal chi tiết */}
      <Modal
        show={!!selectedPayment}
        onHide={() => setSelectedPayment(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <InfoCircle className="me-2" />
            Chi tiết thanh toán #{selectedPayment?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Khách hàng:</strong>{" "}
                {selectedPayment.user?.username || "—"}
              </div>
              <div className="col-md-6">
                <strong>Email:</strong> {selectedPayment.user?.email || "—"}
              </div>
              <div className="col-md-6">
                <strong>Đơn hàng:</strong> #{selectedPayment.orderId}
              </div>
              <div className="col-md-6">
                <strong>Số tiền:</strong>{" "}
                <span className="text-success fw-bold">
                  {Number(selectedPayment.amount).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="col-md-6">
                <strong>Phương thức:</strong>{" "}
                <span
                  className={`badge ${
                    METHOD_BADGE[selectedPayment.method] || "bg-secondary"
                  }`}
                >
                  {selectedPayment.method?.toUpperCase()}
                </span>
              </div>
              <div className="col-md-6">
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`badge ${
                    STATUS_LABELS[selectedPayment.status]?.class
                  }`}
                >
                  {STATUS_LABELS[selectedPayment.status]?.text}
                </span>
              </div>
              <div className="col-md-6">
                <strong>Mã giao dịch:</strong>{" "}
                {selectedPayment.transactionId || "—"}
              </div>
              <div className="col-md-6">
                <strong>Ghi chú:</strong> {selectedPayment.note || "—"}
              </div>
              <div className="col-12">
                <strong>Thời gian tạo:</strong> <Calendar3 className="me-1" />
                {new Date(selectedPayment.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedPayment(null)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận */}
      <Modal
        show={actionModal.show}
        onHide={() => setActionModal({ ...actionModal, show: false })}
        centered
      >
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>
            <ExclamationTriangleFill className="me-2" />
            Xác nhận hành động
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{actionModal.message}</p>
          {actionModal.actionFn === refundPayment && (
            <Form.Group className="mt-2">
              <Form.Label>Lý do hoàn tiền</Form.Label>
              <Form.Control
                type="text"
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                placeholder="Nhập lý do hoàn tiền"
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setActionModal({ ...actionModal, show: false })}
          >
            Hủy
          </Button>
          <Button variant="warning" onClick={confirmAction}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentPage;
