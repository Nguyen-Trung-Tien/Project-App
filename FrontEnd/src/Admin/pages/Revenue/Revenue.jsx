import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import {
  BarChart,
  PieChart,
  GraphUp,
  BoxSeam,
  Funnel,
  ArrowClockwise,
  CurrencyDollar,
  Cart,
  People,
} from "react-bootstrap-icons";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Revenue.scss";
import { getAllOrders } from "../../../api/orderApi";
import { getAllOrderItems } from "../../../api/orderItemApi";
import { getDashboard } from "../../../api/adminApi";
import AppPagination from "../../../components/Pagination/Pagination";
import { useSelector } from "react-redux";

const COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#ff006e"];
const STATUS_COLORS = {
  pending: "warning",
  confirmed: "info",
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "danger",
};
const STATUS_LABELS = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đã gửi",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const Revenue = () => {
  const token = useSelector((state) => state.user.token);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [dateFilter, setDateFilter] = useState("7days");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const tableTopRef = useRef(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const fetchData = async () => {
    setLoading(true);
    setChartLoading(true);
    try {
      const [ordersRes, orderItemsRes, dashboardRes] = await Promise.all([
        getAllOrders(1, 1000, token),
        getAllOrderItems(token),
        getDashboard(token),
      ]);

      let orderList = [];
      if (ordersRes?.errCode === 0 && Array.isArray(ordersRes.data)) {
        orderList = ordersRes.data;
        setOrders(orderList);
      }

      if (dashboardRes?.errCode === 0 && Array.isArray(dashboardRes.data)) {
        const backendData = dashboardRes.data.map((item) => ({
          name: item.day || item.date || "N/A",
          value: parseFloat(item.revenue || 0),
        }));
        setRevenueData(
          backendData.sort((a, b) => new Date(a.name) - new Date(b.name))
        );
      } else {
        const revenueMap = {};
        orderList.forEach((order) => {
          const date = new Date(order.createdAt).toISOString().split("T")[0];
          const total = parseFloat(order.totalPrice || 0);
          revenueMap[date] = (revenueMap[date] || 0) + total;
        });
        const revenueArray = Object.entries(revenueMap)
          .map(([day, value]) => ({ name: day, value }))
          .sort((a, b) => new Date(a.name) - new Date(b.name));
        setRevenueData(revenueArray);
      }

      if (orderItemsRes?.errCode === 0 && Array.isArray(orderItemsRes.data)) {
        const items = orderItemsRes.data;
        const productMap = {};
        items.forEach((item) => {
          const name = item.productName || `SP #${item.productId}`;
          productMap[name] = (productMap[name] || 0) + item.quantity;
        });
        const productArray = Object.entries(productMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setProductsData(productArray);
      }

      const statusMap = {};
      orderList.forEach((order) => {
        const status = order.status || "unknown";
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      const statusArray = Object.entries(statusMap).map(([status, amount]) => ({
        status: STATUS_LABELS[status] || status,
        amount,
      }));
      setOrdersByStatus(statusArray);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    const now = new Date();
    const daysMap = { "7days": 7, "30days": 30, all: 3650 };

    if (dateFilter !== "all") {
      const cutoff = new Date(now.setDate(now.getDate() - daysMap[dateFilter]));
      filtered = filtered.filter((o) => new Date(o.createdAt) >= cutoff);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(term) ||
          o.user?.username?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [orders, dateFilter, searchTerm]);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + parseFloat(o.totalPrice || 0),
      0
    );
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const deliveredCount = filteredOrders.filter(
      (o) => o.status === "delivered"
    ).length;

    return { totalRevenue, totalOrders, avgOrderValue, deliveredCount };
  }, [filteredOrders]);

  useEffect(() => {
    const total = filteredOrders.length;
    const calculatedTotalPages = Math.ceil(total / limit) || 1;
    setTotalPages(calculatedTotalPages);

    if (page > calculatedTotalPages) {
      setPage(1);
    }
  }, [filteredOrders, limit, page]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, page, limit]);

  return (
    <div className="revenue-page">
      <Container fluid className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="m-0 d-flex align-items-center gap-2">
            <GraphUp className="text-success" /> Thống kê doanh thu
          </h3>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <ArrowClockwise className={loading ? "spin" : ""} /> Làm mới
          </Button>
        </div>

        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-primary">
                  <CurrencyDollar />
                </div>
                <div className="ms-3">
                  <small className="text-muted">Tổng doanh thu</small>
                  <h5 className="mb-0">{formatCurrency(stats.totalRevenue)}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-success">
                  <Cart />
                </div>
                <div className="ms-3">
                  <small className="text-muted">Tổng đơn hàng</small>
                  <h5 className="mb-0">{stats.totalOrders}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-info">
                  <BoxSeam />
                </div>
                <div className="ms-3">
                  <small className="text-muted">Đã giao</small>
                  <h5 className="mb-0">{stats.deliveredCount}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-warning">
                  <People />
                </div>
                <div className="ms-3">
                  <small className="text-muted">Giá trị trung bình</small>
                  <h5 className="mb-0">
                    {formatCurrency(stats.avgOrderValue)}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center g-3">
              <Col md={4}>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <Funnel />
                  </InputGroup.Text>
                  <Form.Select
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="7days">7 ngày gần nhất</option>
                    <option value="30days">30 ngày gần nhất</option>
                    <option value="all">Toàn bộ</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup size="sm">
                  <InputGroup.Text>Search</InputGroup.Text>
                  <Form.Control
                    placeholder="Mã đơn, khách hàng..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Charts */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2">
                  <BarChart className="text-primary" /> Doanh thu theo ngày
                </h5>
                {chartLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <RechartsBarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Bar
                        dataKey="value"
                        fill="#4361ee"
                        radius={[8, 8, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2">
                  <PieChart className="text-success" /> Top 5 sản phẩm bán chạy
                </h5>
                {chartLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : productsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <RechartsPieChart>
                      <Pie
                        data={productsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {productsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-5">
                    Chưa có dữ liệu
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Orders Table */}
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="d-flex align-items-center gap-2 mb-3">
              <BoxSeam className="text-info" /> Danh sách đơn hàng
            </h5>
            <div ref={tableTopRef}>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          Không có đơn hàng
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order, idx) => {
                        const displayIndex = (page - 1) * limit + idx + 1;
                        return (
                          <tr key={order.id}>
                            <td>{displayIndex}</td>
                            <td>
                              <strong>DH{order.id}</strong>
                            </td>
                            <td>{order.user?.username || "Ẩn danh"}</td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="fw-bold text-danger">
                              {formatCurrency(order.totalPrice)}
                            </td>
                            <td>
                              <Badge
                                bg={STATUS_COLORS[order.status] || "secondary"}
                                className="px-3 py-2 rounded-pill text-uppercase"
                              >
                                {STATUS_LABELS[order.status] || "N/A"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>

              <AppPagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPageChange={(p) => {
                  setPage(p);
                  tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Revenue;
