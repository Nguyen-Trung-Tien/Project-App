import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: 128,
      icon: <FaBox size={24} />,
      change: "+8%",
      isIncrease: true,
    },
    {
      title: "Đơn hàng hôm nay",
      value: 12,
      icon: <FaShoppingCart size={24} />,
      change: "+5%",
      isIncrease: true,
    },
    {
      title: "Doanh thu",
      value: "12,500,000₫",
      icon: <FaDollarSign size={24} />,
      change: "-3%",
      isIncrease: false,
    },
    {
      title: "Người dùng",
      value: 540,
      icon: <FaUsers size={24} />,
      change: "+2%",
      isIncrease: true,
    },
  ];

  return (
    <div className="admin-layout d-flex">
      <div className="main-content flex-grow-1">
        <Container fluid className="p-4">
          <h3 className="mb-4 fw-bold">📊 Thống kê tổng quan</h3>

          {/* Các thẻ thống kê */}
          <Row>
            {stats.map((item, i) => (
              <Col key={i} md={3} sm={6} className="mb-4">
                <StatsCard {...item} />
              </Col>
            ))}
          </Row>

          {/* Biểu đồ */}
          <Row className="mt-4">
            <Col md={12}>
              <ChartCard />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
