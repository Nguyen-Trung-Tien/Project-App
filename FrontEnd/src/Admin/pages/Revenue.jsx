import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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
import { getAllOrders } from "../../api/orderApi";
import { getAllOrderItems } from "../../api/orderItemApi";
import { getDashboard } from "../../api/adminApi";
import ChartCard from "../components/ChartCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ordersStatusColors = {
  pending: "warning", // Chờ xử lý
  confirmed: "info", // Đã xác nhận
  processing: "primary", // Đang xử lý
  shipped: "secondary", // Đã gửi hàng
  delivered: "success", // Đã giao
  cancelled: "danger", // Đã hủy
};

const Revenue = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, orderItemsRes, dashboardRes] = await Promise.all([
          getAllOrders(),
          getAllOrderItems(),
          getDashboard(),
        ]);

        // 🧾 Đơn hàng
        if (ordersRes?.errCode === 0) {
          const orderList = ordersRes.data || [];
          setOrders(orderList);

          // 📊 Doanh thu theo ngày
          const revenueMap = {};
          orderList.forEach((order) => {
            const date = new Date(order.createdAt).toISOString().split("T")[0];
            const total = parseFloat(order.totalPrice || 0);
            revenueMap[date] = (revenueMap[date] || 0) + total;
          });

          const revenueArray = Object.entries(revenueMap).map(
            ([day, value]) => ({
              name: day,
              value,
            })
          );
          setRevenueData(revenueArray);

          // 📦 Đơn hàng theo trạng thái
          const statusMap = {};
          orderList.forEach((order) => {
            const status = order.status || "unknown";
            statusMap[status] = (statusMap[status] || 0) + 1;
          });

          const statusArray = Object.entries(statusMap).map(
            ([status, amount]) => ({
              status,
              amount,
            })
          );
          setOrdersByStatus(statusArray);
        }

        // 🛍️ Sản phẩm bán chạy
        if (orderItemsRes?.errCode === 0) {
          const items = orderItemsRes.data || [];
          const productMap = {};

          items.forEach((item) => {
            const name = item.productName || `SP #${item.productId}`;
            productMap[name] = (productMap[name] || 0) + item.quantity;
          });

          const productArray = Object.entries(productMap).map(
            ([name, value]) => ({
              name,
              value,
            })
          );

          setProductsData(productArray.slice(0, 5));
        }

        // 📅 Doanh thu backend
        if (dashboardRes?.errCode === 0 && Array.isArray(dashboardRes.data)) {
          const backendRevenue = dashboardRes.data.map((item) => ({
            name: item.day || item.date || "N/A",
            value: parseFloat(item.revenue || 0),
          }));

          if (backendRevenue.length > 0) {
            setRevenueData(backendRevenue);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="admin-layout d-flex">
        <div className="main-content flex-grow-1">
          <Container fluid className="p-4">
            <h3 className="mb-4 fw-bold">📈 Thống kê doanh thu</h3>

            <Row className="mt-4">
              <Col md={12}>
                <ChartCard />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4">
                <Card className="shadow-sm border-0 rounded-4 p-3">
                  <h5>🔥 Sản phẩm bán chạy</h5>
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

              <Col md={6} className="mb-4">
                <Card className="shadow-sm border-0 rounded-4 p-3">
                  <h5>📊 Đơn hàng theo trạng thái</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ordersByStatus}>
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

            {/* 🧾 Bảng chi tiết đơn hàng */}
            <Card className="shadow-sm border-0 rounded-4 p-3">
              <h5 className="mb-3">📋 Chi tiết đơn hàng</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày tạo</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{idx + 1}</td>
                      <td>{`DH${order.id}`}</td>
                      <td>{order.user?.username || "Ẩn danh"}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(order.totalPrice)}
                      </td>
                      <td>
                        <Badge
                          bg={ordersStatusColors[order.status] || "secondary"}
                          className="text-uppercase px-3 py-2 rounded-pill"
                        >
                          {{
                            pending: "Chờ xử lý",
                            confirmed: "Đã xác nhận",
                            processing: "Đang xử lý",
                            shipped: "Đã gửi hàng",
                            delivered: "Đã giao",
                            cancelled: "Đã hủy",
                          }[order.status] || "Không xác định"}
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
