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
    <div className="checkout-success-page d-flex align-items-center justify-content-center py-5">
      <Container className="text-center">
        <motion.div
          className="success-icon text-success mb-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <CheckCircleFill size={100} />
        </motion.div>

        <motion.h2
          className="fw-bold text-success mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thanh toán thành công!
        </motion.h2>

        <motion.p
          className="text-muted mb-3"
          style={{ lineHeight: 1.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Cảm ơn bạn đã mua hàng tại{" "}
          <span className="brand-highlight text-primary">T</span>ien-
          <span className="brand-highlight text-primary">T</span>ech. Đơn hàng
          của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </motion.p>

        <motion.div
          className="order-info mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h6>Mã đơn hàng của bạn:</h6>
          <p className="order-code fw-bold text-primary">
            #
            {orderId
              ? `DH${orderId}`
              : `TS${Math.floor(Math.random() * 1000000)}`}
          </p>
        </motion.div>

        <motion.div
          className="button-group d-flex justify-content-center gap-3 flex-wrap mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="primary"
            className="px-4 py-2 d-flex align-items-center gap-2"
            onClick={() => navigate("/")}
          >
            <HouseDoor /> Về trang chủ
          </Button>

          <Button
            variant="outline-secondary"
            className="px-4 py-2 d-flex align-items-center gap-2"
            onClick={() => navigate("/orders")}
          >
            <Receipt /> Xem đơn hàng
          </Button>
        </motion.div>

        <motion.p
          className="text-muted small"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Bạn sẽ được chuyển hướng đến trang <strong>đơn hàng</strong> sau{" "}
          <span className="fw-semibold text-primary">5 giây...</span>
        </motion.p>
      </Container>
    </div>
  );
};

export default CheckoutSuccess;
