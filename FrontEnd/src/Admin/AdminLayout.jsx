import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../Admin/components/HeaderAdmin";
import Sidebar from "./components/Sidebar";
const AdminLayout = () => {
  return (
    <div className="admin-layout bg-light" style={{ minHeight: "100vh" }}>
      <Row className="g-0">
        <Col md={2} className="bg-dark text-white p-0">
          <Sidebar />
        </Col>
        <Col md={10}>
          <HeaderAdmin />
          <Container fluid className="p-4">
            <Outlet />
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default AdminLayout;
