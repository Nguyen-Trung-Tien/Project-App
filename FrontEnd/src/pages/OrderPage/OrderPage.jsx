import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Spinner } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./OrderPage.scss";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { toast } from "react-toastify";
import { getAllOrders } from "../../api/orderApi";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders();
        if (res?.errCode === 0 && Array.isArray(res?.data)) {
          setOrders(res.data);
        } else {
          toast.warning(res?.errMessage || "Không thể tải đơn hàng");
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách đơn hàng");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => !filter || order.status === filter
  );

  return (
    <div className="order-page py-2">
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

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : (
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
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{Number(order.totalAmount).toLocaleString()} ₫</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/orders-detail/${order.id}`)}
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
        )}
      </Container>
    </div>
  );
};

export default OrderPage;
