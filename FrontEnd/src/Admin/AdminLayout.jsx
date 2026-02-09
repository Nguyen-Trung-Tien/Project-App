import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.scss";
import HeaderAdmin from "./components/HeaderAdminComponent/HeaderAdmin";
import Sidebar from "./components/SidebarComponent/Sidebar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} />
      <div className="admin-main">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
