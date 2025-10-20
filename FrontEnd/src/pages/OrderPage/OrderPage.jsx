import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./OrderPage.scss";
import StatusBadge from "../../components/StatusBadge/StatusBadge";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập dữ liệu từ API
    const demoOrders = [
      {
        id: "OD123456",
        date: "2025-10-15",
        total: 1250000,
        status: "delivered",
      },
      {
        id: "OD123457",
        date: "2025-10-17",
        total: 780000,
        status: "shipping",
      },
      {
        id: "OD123458",
        date: "2025-10-18",
        total: 355000,
        status: "pending",
      },
      {
        id: "OD123459",
        date: "2025-10-19",
        total: 600000,
        status: "cancelled",
      },
    ];
    setOrders(demoOrders);
  }, []);

  const filteredOrders = orders.filter(
    (order) => !filter || order.status === filter
  );

  return (
    <div className="order-page py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="fw-bold text-primary">Đơn hàng của tôi</h2>
          <Form.Select
            className="w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </Form.Select>
        </div>

        <Table responsive bordered hover className="order-table">
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order.id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.total.toLocaleString()} ₫</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="me-1" /> Xem
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Không có đơn hàng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default OrderPage;
