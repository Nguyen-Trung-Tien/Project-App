import React, { useEffect, useState } from "react";
import { Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers } from "react-icons/fa";
import "./Dashboard.scss";
import StatsCard from "../../components/StatsCardComponent/StatsCard";
import ChartCard from "../../components/ChartCardComponent/ChartCard";
import { getDashboard } from "../../../api/adminApi";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const token = useSelector((state) => state.user.token);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboard();
        if (res?.errCode === 0 && res?.data) {
          let data = res.data;

          if (Array.isArray(data)) {
            data = data[0] || {};
          }

          const {
            totalProducts = 0,
            todayOrders = 0,
            totalRevenue = 0,
            totalUsers = 0,
            change = {},
          } = data;

          const {
            products: changeProducts = 0,
            orders: changeOrders = 0,
            revenue: changeRevenue = 0,
            users: changeUsers = 0,
          } = change;

          const formatCurrency = (value) =>
            Number(value).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            });

          setStats([
            {
              title: "Tổng sản phẩm",
              value: Number(totalProducts).toLocaleString(),
              icon: <FaBox size={24} />,
              change: `${changeProducts > 0 ? "+" : ""}${changeProducts}%`,
              isIncrease: changeProducts >= 0,
              link: "/admin/products",
            },
            {
              title: "Đơn hàng hôm nay",
              value: Number(todayOrders).toLocaleString(),
              icon: <FaShoppingCart size={24} />,
              change: `${changeOrders > 0 ? "+" : ""}${changeOrders}%`,
              isIncrease: changeOrders >= 0,
              link: "/admin/orders",
            },
            {
              title: "Doanh thu",
              value: formatCurrency(totalRevenue),
              icon: <FaDollarSign size={24} />,
              change: `${changeRevenue > 0 ? "+" : ""}${changeRevenue}%`,
              isIncrease: changeRevenue >= 0,
              link: "/admin/revenue",
            },
            {
              title: "Người dùng",
              value: Number(totalUsers).toLocaleString(),
              icon: <FaUsers size={24} />,
              change: `${changeUsers > 0 ? "+" : ""}${changeUsers}%`,
              isIncrease: changeUsers >= 0,
              link: "/admin/users",
            },
          ]);
        } else {
          setError("Không thể tải dữ liệu dashboard.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Lỗi kết nối server. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <Container fluid>
          <h3 className="mb-4 fw-bold d-flex align-items-center gap-2">
            Thống kê tổng quan
          </h3>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="mx-3">
              {error}
            </Alert>
          ) : stats.length > 0 ? (
            <>
              <Row className="g-3 mb-4">
                {stats.map((item, i) => (
                  <Col key={i} md={3} sm={6}>
                    <Link to={item.link} style={{ textDecoration: "none" }}>
                      <StatsCard {...item} />
                    </Link>
                  </Col>
                ))}
              </Row>

              <Row>
                <Col md={12}>
                  <ChartCard token={token} />
                </Col>
              </Row>
            </>
          ) : (
            <Alert variant="warning" className="mx-3">
              Không có dữ liệu thống kê.
            </Alert>
          )}
      </Container>
    </div>
  );
};

export default Dashboard;
