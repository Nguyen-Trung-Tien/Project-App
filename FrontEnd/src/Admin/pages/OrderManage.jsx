import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Badge,
  Dropdown,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import "../Layout.scss";
import Loading from "../../components/Loading/Loading";

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

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

  return (
    <>
      {loading && <Loading />}
      <div>
        <h3 className="mb-4">📦 Quản lý đơn hàng</h3>

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
                  <th>Sản phẩm</th>
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
                    <td>{`DH${order.id}`}</td>
                    <td className="text-start">{order.user?.username}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-start">
                      {order.orderItems
                        ?.filter((item) => item.returnStatus !== "none")
                        .map((item) => (
                          <div key={item.id} className="mb-1">
                            <div>
                              <strong>Trạng thái trả hàng : </strong> {""}
                              {getReturnBadge(item.returnStatus)}
                            </div>
                            <div>
                              <strong>Tên sản phẩm:</strong>
                              {""} {item.productName}
                            </div>{" "}
                            <span>
                              <strong>Số lượng: {item.quantity}</strong>
                            </span>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                              title={item.returnReason}
                            >
                              <strong>Lý do trả:</strong> {item.returnReason}
                            </div>
                          </div>
                        ))}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center flex-wrap gap-1">
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm">
                            Cập nhật
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

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => navigate(`/orders-detail/${order.id}`)}
                        >
                          Chi tiết
                        </Button>

                        {order.status === "shipped" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleReceiveOrder(order.id)}
                          >
                            Nhận hàng
                          </Button>
                        )}

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

                        {order.orderItems?.some(
                          (item) => item.returnStatus === "requested"
                        ) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              navigate(`/admin/orders-return/${order.id}`)
                            }
                          >
                            Quản lý trả hàng
                          </Button>
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
    </>
  );
};

export default OrderManage;
