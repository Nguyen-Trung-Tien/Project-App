import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Badge,
  Dropdown,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { requestReturn, processReturn } from "../../api/orderItemApi";
import "../Layout.scss";

const OrderManage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const statusMap = {
    pending: { label: "Chờ xử lý", variant: "warning" },
    confirmed: { label: "Đã xác nhận", variant: "info" },
    processing: { label: "Đang xử lý", variant: "primary" },
    shipped: { label: "Đang giao", variant: "primary" },
    delivered: { label: "Đã giao", variant: "success" },
    cancelled: { label: "Đã hủy", variant: "danger" },
  };

  const returnStatusMap = {
    none: { label: "Không trả", variant: "secondary" },
    requested: { label: "Đã yêu cầu", variant: "warning" },
    approved: { label: "Được duyệt", variant: "success" },
    rejected: { label: "Bị từ chối", variant: "danger" },
    completed: { label: "Hoàn tất", variant: "primary" },
  };

  const getStatusBadge = (status) => {
    const info = statusMap[status] || { label: status, variant: "secondary" };
    return <Badge bg={info.variant}>{info.label}</Badge>;
  };

  const getReturnBadge = (status) => {
    const info = returnStatusMap[status] || {
      label: status,
      variant: "secondary",
    };
    return <Badge bg={info.variant}>{info.label}</Badge>;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res?.errCode === 0) setOrders(res.data);
      else toast.error(res?.errMessage || "Không thể tải đơn hàng");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const res = await updateOrderStatus(orderId, status);
      if (res?.errCode === 0)
        toast.success(`Cập nhật thành công: ${statusMap[status]?.label}`);
      else toast.error(res?.errMessage || "Cập nhật thất bại");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveOrder = (orderId) =>
    handleUpdateStatus(orderId, "delivered");

  const handleRequestReturn = async (itemId) => {
    const reason = prompt("Nhập lý do trả hàng:");
    if (!reason) return;
    try {
      const res = await requestReturn(itemId, reason);
      if (res?.errCode === 0) toast.success("Yêu cầu trả hàng đã gửi");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi gửi yêu cầu trả hàng");
    }
  };

  const handleProcessReturn = async (itemId) => {
    const action = prompt(
      "Nhập trạng thái xử lý trả hàng (approved/rejected/completed):"
    );
    if (!action) return;
    try {
      const res = await processReturn(itemId, action);
      if (res?.errCode === 0) toast.success("Xử lý trả hàng thành công");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi xử lý trả hàng");
    }
  };

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

  return (
    <div>
      <h3 className="mb-4">📦 Quản lý đơn hàng</h3>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <h5>Tổng đơn hàng: {orders.length}</h5>
            </Col>
          </Row>

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
                <th className="text-start">Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Trả hàng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td className="text-start">{order.user?.username}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    {order.orderItems?.map((item) => (
                      <div key={item.id}>
                        {getReturnBadge(item.returnStatus)}
                      </div>
                    ))}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center flex-wrap gap-1">
                      {/* Cập nhật trạng thái */}
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm">
                          Cập nhật
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {Object.keys(statusMap).map((key) => (
                            <Dropdown.Item
                              key={key}
                              onClick={() => handleUpdateStatus(order.id, key)}
                              className={
                                key === "cancelled" ? "text-danger" : ""
                              }
                            >
                              {statusMap[key].label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* Chi tiết */}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate(`/orders-detail/${order.id}`)}
                      >
                        Chi tiết
                      </Button>

                      {/* Nhận hàng */}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleReceiveOrder(order.id)}
                        >
                          Nhận hàng
                        </Button>
                      )}

                      {/* Hủy đơn */}
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleUpdateStatus(order.id, "cancelled")
                          }
                        >
                          Hủy đơn
                        </Button>
                      )}

                      {/* Yêu cầu trả hàng */}
                      {order.orderItems?.map(
                        (item) =>
                          item.returnStatus === "none" &&
                          order.status === "delivered" && (
                            <Button
                              key={item.id}
                              size="sm"
                              variant="warning"
                              onClick={() => handleRequestReturn(item.id)}
                            >
                              Yêu cầu trả hàng
                            </Button>
                          )
                      )}

                      {/* Xử lý trả hàng */}
                      {order.orderItems?.map(
                        (item) =>
                          item.returnStatus === "requested" && (
                            <Button
                              key={item.id}
                              size="sm"
                              variant="danger"
                              onClick={() => handleProcessReturn(item.id)}
                            >
                              Xử lý trả hàng
                            </Button>
                          )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderManage;
