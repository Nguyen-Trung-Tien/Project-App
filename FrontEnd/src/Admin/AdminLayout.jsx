import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../Admin/components/HeaderAdmin";
import Sidebar from "./components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="admin-layout bg-light" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div
        className="admin-main-content"
        style={{
          marginLeft: "240px",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <HeaderAdmin />
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
