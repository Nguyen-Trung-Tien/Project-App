import React, { useEffect, useState } from "react";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers } from "react-icons/fa";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import { getDashboard } from "../../api/adminApi";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await getDashboard();
        if (res?.errCode === 0 && res?.data) {
          const {
            totalProducts,
            todayOrders,
            totalRevenue,
            totalUsers,
            change = {},
          } = res.data;
          const { products = 0, orders = 0, revenue = 0, users = 0 } = change;

          setStats([
            {
              title: "Tổng sản phẩm",
              value: totalProducts,
              icon: <FaBox size={24} />,
              change: `${products > 0 ? "+" : ""}${products}%`,
              isIncrease: products >= 0,
              link: "/admin/products",
            },
            {
              title: "Đơn hàng hôm nay",
              value: todayOrders,
              icon: <FaShoppingCart size={24} />,
              change: `${orders > 0 ? "+" : ""}${orders}%`,
              isIncrease: orders >= 0,
              link: "/admin/orders",
            },
            {
              title: "Doanh thu",
              value: totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
              icon: <FaDollarSign size={24} />,
              change: `${revenue > 0 ? "+" : ""}${revenue}%`,
              isIncrease: revenue >= 0,
              link: "/admin/revenue",
            },
            {
              title: "Người dùng",
              value: totalUsers,
              icon: <FaUsers size={24} />,
              change: `${users > 0 ? "+" : ""}${users}%`,
              isIncrease: users >= 0,
              link: "/admin/users",
            },
          ]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="admin-layout d-flex">
      <div className="main-content flex-grow-1">
        <Container fluid className="p-4">
          <h3 className="mb-4 fw-bold">📊 Thống kê tổng quan</h3>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
              }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Row>
                {stats.length > 0 ? (
                  stats.map((item, i) => (
                    <Col key={i} md={3} sm={6} className="mb-4">
                      <Link to={item.link} style={{ textDecoration: "none" }}>
                        <StatsCard {...item} />
                      </Link>
                    </Col>
                  ))
                ) : (
                  <p className="text-muted text-center">
                    Không có dữ liệu thống kê.
                  </p>
                )}
              </Row>
              <Row className="mt-4">
                <Col md={12}>
                  <ChartCard />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
