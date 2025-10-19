import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="notfound-page d-flex flex-column align-items-center justify-content-center text-center">
      <FiAlertTriangle className="icon-warning mb-3" />
      <h1 className="fw-bold display-4 text-danger">404</h1>
      <h4 className="mb-3 text-secondary">Trang không tồn tại</h4>
      <p className="text-muted mb-4">
        Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link to="/" className="btn btn-primary px-4">
        ⬅️ Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
