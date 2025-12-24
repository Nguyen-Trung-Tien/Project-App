import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { CheckCircleFill, HouseDoor, Receipt } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./CheckoutSuccess.scss";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/orders"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="checkout-success-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <motion.div
          className="success-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ICON */}
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <CheckCircleFill />
          </motion.div>

          {/* TITLE */}
          <h2 className="success-title">Thanh toán thành công</h2>

          {/* DESCRIPTION */}
          <p className="success-desc">
            Cảm ơn bạn đã mua hàng tại <span className="brand">TienTech</span>.
            Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.
          </p>

          {/* ORDER CODE */}
          <div className="order-box">
            <span>Mã đơn hàng</span>
            <strong>
              #
              {orderId
                ? `DH${orderId}`
                : `TS${Math.floor(Math.random() * 1000000)}`}
            </strong>
          </div>

          {/* ACTIONS */}
          <div className="action-group">
            <Button
              variant="primary"
              className="btn-main"
              onClick={() => navigate("/")}
            >
              <HouseDoor /> Trang chủ
            </Button>

            <Button
              variant="outline-secondary"
              className="btn-sub"
              onClick={() => navigate("/orders")}
            >
              <Receipt /> Đơn hàng
            </Button>
          </div>

          {/* AUTO REDIRECT */}
          <p className="redirect-text">
            Tự động chuyển đến <strong>đơn hàng</strong> sau <span>5 giây</span>
          </p>
        </motion.div>
      </Container>
    </div>
  );
};

export default CheckoutSuccess;
