import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Modal, Card } from "react-bootstrap";
import { getAllOrders } from "../../api/orderApi";
import "./OrdersReturnPage.scss";
import { processReturn } from "../../api/orderItemApi";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router";

const OrdersReturnPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res.errCode === 0 && Array.isArray(res.data)) {
        const filtered = res.data.filter((o) =>
          o.orderItems.some((i) => i.returnStatus === "requested")
        );
        setOrders(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleProcessReturn = async (orderId, status) => {
    if (!selectedOrder) return;
    try {
      for (let item of selectedOrder.orderItems) {
        if (item.returnStatus === "requested") {
          await processReturn(item.id, status);
        }
      }
      fetchOrders();
      setModalShow(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString("vi-VN") + " ₫";
  const handleBack = () => {
    navigate("/admin/orders");
  };
  return (
    <Container className="py-4">
      <h3 className="mb-4">🛠 Quản lý trả hàng</h3>

      {loading && <Loading />}
      <Card.Header className="bg-white border-0  pb-3">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          className="rounded-pill px-3 py-1"
        >
          ← Quay lại
        </Button>
      </Card.Header>
      {!loading && (
        <Card className="shadow-sm">
          <Card.Body>
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
                  <th>Khách hàng</th>
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
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Không có đơn trả hàng nào
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user?.username}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.orderItems.some(
                        (i) => i.returnStatus === "requested"
                      ) && <Badge bg="warning">Đã yêu cầu</Badge>}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalShow(true);
                        }}
                      >
                        Xử lý trả hàng
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xử lý trả hàng - Mã đơn {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Lý do trả</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems
                  .filter((i) => i.returnStatus === "requested")
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.productId}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                        title={item.returnReason}
                      >
                        {item.returnReason}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => handleProcessReturn(selectedOrder.id, "approved")}
          >
            Duyệt
          </Button>
          <Button
            variant="danger"
            onClick={() => handleProcessReturn(selectedOrder.id, "rejected")}
          >
            Từ chối
          </Button>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersReturnPage;
