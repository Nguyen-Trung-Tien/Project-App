import React, { useState } from "react";
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
import "../Layout.scss";
import Loading from "../../components/Loading/Loading";

const OrderManage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      total: 250000,
      status: "pending",
      date: "2025-10-10",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      total: 550000,
      status: "shipping",
      date: "2025-10-12",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      total: 1250000,
      status: "completed",
      date: "2025-10-13",
    },
  ]);

  const statusMap = {
    pending: { label: "Chờ xử lý", variant: "warning" },
    shipping: { label: "Đang giao", variant: "info" },
    completed: { label: "Hoàn tất", variant: "success" },
    canceled: { label: "Đã hủy", variant: "danger" },
  };

  const getStatusBadge = (status) => {
    const info = statusMap[status] || { label: status, variant: "secondary" };
    return <Badge bg={info.variant}>{info.label}</Badge>;
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const formatCurrency = (value) => value.toLocaleString("vi-VN") + " ₫";

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
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td className="text-start">{order.customer}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Dropdown container="body">
                          <Dropdown.Toggle variant="outline-primary" size="sm">
                            <i className="bi bi-pencil-square me-1"></i> Cập
                            nhật
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {Object.keys(statusMap).map((key) => (
                              <Dropdown.Item
                                key={key}
                                onClick={() => updateStatus(order.id, key)}
                                className={
                                  key === "canceled" ? "text-danger" : ""
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
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <i className="bi bi-eye me-1"></i> Chi tiết
                        </Button>
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
