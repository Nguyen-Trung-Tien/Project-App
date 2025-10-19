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
import "../Layout.scss";

const OrderManage = () => {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Chờ xử lý</Badge>;
      case "shipping":
        return <Badge bg="info">Đang giao</Badge>;
      case "completed":
        return <Badge bg="success">Hoàn tất</Badge>;
      case "canceled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div>
      <h3 className="mb-4">📦 Quản lý đơn hàng</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <h5>Tổng đơn hàng: {orders.length}</h5>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.date}</td>
                  <td>{o.total.toLocaleString()} ₫</td>
                  <td>{getStatusBadge(o.status)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-primary"
                        size="sm"
                        id={`dropdown-${o.id}`}
                      >
                        Cập nhật
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => updateStatus(o.id, "pending")}
                        >
                          Chờ xử lý
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => updateStatus(o.id, "shipping")}
                        >
                          Đang giao
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => updateStatus(o.id, "completed")}
                        >
                          Hoàn tất
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => updateStatus(o.id, "canceled")}
                        >
                          Hủy đơn
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ms-2"
                    >
                      Chi tiết
                    </Button>
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
