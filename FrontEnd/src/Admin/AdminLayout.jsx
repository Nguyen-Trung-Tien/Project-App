import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../Admin/components/HeaderAdmin";
import Sidebar from "./components/Sidebar";
import "./Layout.scss";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`admin-layout bg-light d-flex ${collapsed ? "collapsed" : ""}`}
    >
      <Sidebar collapsed={collapsed} />
      <div className="admin-main flex-grow-1 d-flex flex-column">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <div className="p-4 flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
