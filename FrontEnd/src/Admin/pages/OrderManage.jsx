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
  Spinner,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { updatePayment } from "../../api/paymentApi";
import "../Layout.scss";
import {
  paymentStatusMap,
  returnStatusMap,
  statusMap,
} from "../../utils/StatusMap";
import { StatusBadge } from "../../utils/StatusBadge";

const OrderManage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchOrders = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await getAllOrders(currentPage, limit);
      if (res?.errCode === 0) {
        setOrders(res.data);
        setPage(res.pagination?.currentPage || currentPage);
        setTotalPages(res.pagination?.totalPages || 1);
      } else toast.error(res?.errMessage);
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

  // //  Mô phỏng hoàn tiền online
  // const simulateRefund = async (order, method) => {
  //   console.log(
  //     `🔁 Bắt đầu hoàn tiền đơn #${order.id} qua ${method.toUpperCase()}...`
  //   );

  //   // Mô phỏng gọi API bên thứ 3 (trong thực tế: axios.post đến endpoint refund)
  //   await new Promise((resolve) => setTimeout(resolve, 1200)); // delay giả lập

  //   // Tùy từng phương thức, bạn có thể log hoặc lưu transactionId
  //   switch (method) {
  //     case "momo":
  //       // gọi API refund MoMo thật: refundId, refundTransId...
  //       break;
  //     case "paypal":
  //       // gọi PayPal SDK refund()
  //       break;
  //     case "vnpay":
  //       // gọi VNPAY refund endpoint
  //       break;
  //     case "bank":
  //       // gọi API của ngân hàng hoặc chuyển hoàn thủ công
  //       break;
  //   }

  //   console.log(`✅ Hoàn tiền thành công cho đơn #${order.id} (${method})`);
  //   return { success: true, message: "Refund completed successfully" };
  // };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoadingId(orderId);
      const res = await updateOrderStatus(orderId, status);

      if (res?.errCode === 0) {
        toast.success(`Cập nhật: ${statusMap[status]?.label}`);
        await fetchOrders();

        const order = orders.find((o) => o.id === orderId);
        const method = order.paymentMethod?.toLowerCase();
        const isOnlineMethod = ["momo", "paypal", "vnpay", "bank"].includes(
          method
        );

        if (
          status === "cancelled" &&
          isOnlineMethod &&
          order.paymentStatus === "paid"
        ) {
          try {
            const refundRes = await updatePayment(orderId, {
              paymentStatus: "refunded",
            });

            if (refundRes?.errCode === 0) {
              toast.success(
                `💸 Đơn hàng ${orderId} đã được hoàn tiền cho khách!`
              );
              await fetchOrders();
            } else {
              toast.error(
                refundRes?.errMessage || "Không thể hoàn tiền tự động"
              );
            }
          } catch (refundErr) {
            console.error(refundErr);
            toast.error("Lỗi khi hoàn tiền khách hàng!");
          }
        }
      } else {
        toast.error(res?.errMessage);
      }
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

    const method = order.paymentMethod?.toLowerCase();

    const canUpdate =
      method === "cod" ||
      (["momo", "paypal", "vnpay", "bank"].includes(method) &&
        order.status === "cancelled");

    if (!canUpdate) {
      toast.info(
        "Chỉ được cập nhật thanh toán cho đơn COD hoặc đơn online đã bị hủy!"
      );
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
        toast.success(
          `Cập nhật thanh toán: ${paymentStatusMap[status]?.label}`
        );
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (startPage > 1)
      items.push(
        <Pagination.First key="first" onClick={() => fetchOrders(1)} />
      );
    if (page > 1)
      items.push(
        <Pagination.Prev key="prev" onClick={() => fetchOrders(page - 1)} />
      );

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => fetchOrders(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (page < totalPages)
      items.push(
        <Pagination.Next key="next" onClick={() => fetchOrders(page + 1)} />
      );
    if (endPage < totalPages)
      items.push(
        <Pagination.Last key="last" onClick={() => fetchOrders(totalPages)} />
      );

    return (
      <Pagination className="justify-content-center mt-3">{items}</Pagination>
    );
  };

  return (
    <>
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
                  <th className="text-start">SĐT</th>
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
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : (
                  orders.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center text-muted py-4">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  )
                )}
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{`DH${order.id}`}</td>
                    <td className="text-start">{order.user?.username}</td>
                    <td className="text-start">{order.user?.phone}</td>
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
                          (order.paymentMethod?.toLowerCase() === "cod" ||
                            (["momo", "paypal", "vnpay", "bank"].includes(
                              order.paymentMethod?.toLowerCase()
                            ) &&
                              order.status === "cancelled")) && (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-success"
                                size="sm"
                                disabled={loadingId === order.id}
                              >
                                {loadingId === order.id ? (
                                  <>
                                    <Spinner
                                      animation="border"
                                      size="sm"
                                      variant="light"
                                      role="status"
                                      className="me-1"
                                    />
                                    Đang cập nhật...
                                  </>
                                ) : (
                                  order.paymentMethod?.toUpperCase()
                                )}
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
                                              key
                                            )
                                          }
                                        >
                                          {paymentStatusMap[key].label}
                                        </Dropdown.Item>
                                      )
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
            {renderPagination()}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default OrderManage;
