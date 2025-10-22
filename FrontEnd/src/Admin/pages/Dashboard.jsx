import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: 128,
      icon: <FaBox size={24} />,
      change: "+8%",
      isIncrease: true,
      link: "/admin/products",
    },
    {
      title: "Đơn hàng hôm nay",
      value: 12,
      icon: <FaShoppingCart size={24} />,
      change: "+5%",
      isIncrease: true,
      link: "/admin/orders",
    },
    {
      title: "Doanh thu",
      value: "12,500,000₫",
      icon: <FaDollarSign size={24} />,
      change: "-3%",
      isIncrease: false,
      link: "/admin/revenue",
    },
    {
      title: "Người dùng",
      value: 540,
      icon: <FaUsers size={24} />,
      change: "+2%",
      isIncrease: true,
      link: "/admin/users",
    },
  ];

  return (
    <>
      {loading && <Loading />}

      <div className="admin-layout d-flex">
        <div className="main-content flex-grow-1">
          <Container fluid className="p-4">
            <h3 className="mb-4 fw-bold">📊 Thống kê tổng quan</h3>

            <Row>
              {stats.map((item, i) => (
                <Col key={i} md={3} sm={6} className="mb-4">
                  <Link to={item.link} style={{ textDecoration: "none" }}>
                    <StatsCard {...item} />
                  </Link>
                </Col>
              ))}
            </Row>

            <Row className="mt-4">
              <Col md={12}>
                <ChartCard />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
