import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Table, Badge } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../Layout.scss";
import Loading from "../../components/Loading/Loading";

const revenueData = [
  { day: "Mon", revenue: 1200000 },
  { day: "Tue", revenue: 900000 },
  { day: "Wed", revenue: 1500000 },
  { day: "Thu", revenue: 1300000 },
  { day: "Fri", revenue: 1700000 },
];

const ordersData = [
  {
    id: 1,
    code: "DH1001",
    customer: "Nguyen Van A",
    date: "2025-10-01",
    amount: 1200000,
    status: "Hoàn tất",
  },
  {
    id: 2,
    code: "DH1002",
    customer: "Tran Thi B",
    date: "2025-10-02",
    amount: 950000,
    status: "Đang giao",
  },
  {
    id: 3,
    code: "DH1003",
    customer: "Le Van C",
    date: "2025-10-03",
    amount: 1750000,
    status: "Hoàn tất",
  },
  {
    id: 4,
    code: "DH1004",
    customer: "Pham Thi D",
    date: "2025-10-03",
    amount: 500000,
    status: "Hủy",
  },
];

const ordersStatusColors = {
  "Hoàn tất": "success",
  "Đang giao": "primary",
  "Đang chờ": "warning",
  Hủy: "danger",
};

const productsData = [
  { name: "Laptop", value: 120 },
  { name: "Điện thoại", value: 150 },
  { name: "Phụ kiện", value: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Revenue = () => {
  const [timeFrame, setTimeFrame] = useState("week");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <div className="admin-layout d-flex">
        <div className="main-content flex-grow-1">
          <Container fluid className="p-4">
            <h3 className="mb-4 fw-bold">💰 Doanh thu chi tiết</h3>

            {/* Biểu đồ doanh thu */}
            <Card className="mb-4 shadow-sm border-0 rounded-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Doanh thu theo ngày</h5>
                <Form.Select
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option value="week">Tuần</option>
                  <option value="month">Tháng</option>
                  <option value="year">Năm</option>
                </Form.Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0d6efd"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Row>
              {/* Sản phẩm bán chạy */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm border-0 rounded-4 p-3">
                  <h5>🛒 Sản phẩm bán chạy</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={productsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {productsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Đơn hàng theo trạng thái */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm border-0 rounded-4 p-3">
                  <h5>📊 Đơn hàng theo trạng thái</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ordersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Bảng chi tiết đơn hàng */}
            <Card className="shadow-sm border-0 rounded-4 p-3">
              <h5 className="mb-3">📋 Chi tiết đơn hàng</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Ngày</th>
                    <th>Giá trị</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{idx + 1}</td>
                      <td>{order.code}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(order.amount)}
                      </td>
                      <td>
                        <Badge bg={ordersStatusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Revenue;
