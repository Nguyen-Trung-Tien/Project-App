import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { updatePayment } from "../../api/paymentApi";
import "../Layout.scss";
import Loading from "../../components/Loading/Loading";

const statusMap = {
  pending: { label: "Chờ xử lý", variant: "warning" },
  confirmed: { label: "Đã xác nhận", variant: "info" },
  processing: { label: "Đang xử lý", variant: "primary" },
  shipped: { label: "Đang giao", variant: "primary" },
  delivered: { label: "Đã giao", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "danger" },
};

const paymentStatusMap = {
  unpaid: { label: "Chưa thanh toán", variant: "secondary" },
  paid: { label: "Đã thanh toán", variant: "success" },
  refunded: { label: "Hoàn tiền", variant: "info" },
};

const returnStatusMap = {
  none: { label: "Không trả", variant: "secondary" },
  requested: { label: "Đã yêu cầu", variant: "warning" },
  approved: { label: "Được duyệt", variant: "success" },
  rejected: { label: "Bị từ chối", variant: "danger" },
  completed: { label: "Hoàn tất", variant: "primary" },
};

const StatusBadge = ({ map, status }) => {
  const info = map[status] || { label: status, variant: "secondary" };
  return <Badge bg={info.variant}>{info.label}</Badge>;
};

const OrderManage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res?.errCode === 0) setOrders(res.data);
      else toast.error(res?.errMessage);
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
      setLoadingId(orderId);
      const res = await updateOrderStatus(orderId, status);
      if (res?.errCode === 0)
        toast.success(`Cập nhật: ${statusMap[status]?.label}`);
      else toast.error(res?.errMessage);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật trạng thái");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdatePaymentStatus = async (order, status) => {
    if (!user || user.role !== "admin") {
      toast.warning("Bạn không có quyền cập nhật thanh toán!");
      return;
    }

    if (order.paymentMethod?.toLowerCase() !== "cod") {
      toast.info("Chỉ đơn hàng COD mới được cập nhật thủ công!");
      return;
    }

    try {
      setLoadingId(order.id);
      const res = await updatePayment(order.id, { paymentStatus: status });
      if (res?.errCode === 0) {
        toast.success(`Thanh toán: ${paymentStatusMap[status]?.label}`);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  payment: res.data,
                  paymentStatus:
                    res.data.status === "completed"
                      ? "paid"
                      : res.data.status === "refunded"
                      ? "refunded"
                      : "unpaid",
                }
              : o
          )
        );
        await fetchOrders();
      } else toast.error(res?.errMessage);
    } catch (err) {
      console.error(err);
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
                  <th>Phương thức TT</th>
                  <th>Trạng thái đơn</th>
                  <th>Thanh toán</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Sản phẩm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">
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
                    <td>{order.paymentMethod?.toUpperCase() || "—"}</td>
                    <td>
                      <StatusBadge map={statusMap} status={order.status} />
                    </td>
                    <td>
                      {paidMethods.includes(
                        order.paymentMethod?.toLowerCase()
                      ) ? (
                        <Badge bg="success">Đã thanh toán</Badge>
                      ) : order.payment ? (
                        <StatusBadge
                          map={paymentStatusMap}
                          status={order.paymentStatus || "unpaid"}
                        />
                      ) : (
                        <Badge bg="secondary">Chưa thanh toán</Badge>
                      )}
                    </td>
                    <td className="text-start">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{order.shippingAddress}</Tooltip>}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "200px",
                          }}
                        >
                          {order.shippingAddress || "—"}
                        </div>
                      </OverlayTrigger>
                    </td>
                    <td className="text-start">
                      {order.orderItems
                        ?.filter((item) => item.returnStatus !== "none")
                        .map((item) => (
                          <div key={item.id} className="mb-2">
                            <div>
                              <strong>Trạng thái trả hàng: </strong>
                              <StatusBadge
                                map={returnStatusMap}
                                status={item.returnStatus}
                              />
                            </div>
                            <div>
                              <strong>Tên sản phẩm:</strong> {item.productName}
                            </div>
                            <div>
                              <strong>Số lượng:</strong> {item.quantity}
                            </div>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "220px",
                              }}
                              title={item.returnReason}
                            >
                              <strong>Lý do:</strong> {item.returnReason}
                            </div>
                          </div>
                        ))}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center flex-wrap gap-1">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-primary"
                            size="sm"
                            disabled={loadingId === order.id}
                          >
                            Cập nhật đơn
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

                        {user?.role === "admin" &&
                          order.paymentMethod?.toLowerCase() === "cod" && (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-success"
                                size="sm"
                                disabled={loadingId === order.id}
                              >
                                Cập nhật TT (COD)
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {Object.keys(paymentStatusMap).map((key) => (
                                  <Dropdown.Item
                                    key={key}
                                    onClick={() =>
                                      handleUpdatePaymentStatus(order, key)
                                    }
                                  >
                                    {paymentStatusMap[key].label}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={loadingId === order.id}
                          onClick={() => navigate(`/orders-detail/${order.id}`)}
                        >
                          Chi tiết
                        </Button>

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
