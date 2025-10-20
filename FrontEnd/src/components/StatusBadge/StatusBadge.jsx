import React from "react";
import { Badge } from "react-bootstrap";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Badge bg="warning" text="dark">
          Chờ xử lý
        </Badge>
      );
    case "confirmed":
      return <Badge bg="info">Đã xác nhận</Badge>;
    case "shipping":
      return <Badge bg="primary">Đang giao</Badge>;
    case "delivered":
      return <Badge bg="success">Đã giao</Badge>;
    case "cancelled":
      return <Badge bg="danger">Đã hủy</Badge>;
    default:
      return <Badge bg="secondary">Không rõ</Badge>;
  }
};

export default StatusBadge;
