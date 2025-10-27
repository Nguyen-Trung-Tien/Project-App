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
      <Container className="text-center py-5">
        <motion.div
          className="success-icon text-success"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <CheckCircleFill size={90} />
        </motion.div>

        <motion.h2
          className="mt-3 fw-bold text-success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thanh toán thành công!
        </motion.h2>

        <motion.p
          className="text-muted mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Cảm ơn bạn đã mua hàng tại <strong>T-Store</strong> 💚 <br />
          Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </motion.p>

        <motion.div
          className="order-info mt-4"
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
          className="mt-5 d-flex justify-content-center gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="primary"
            className="px-4 py-2"
            onClick={() => navigate("/")}
          >
            <HouseDoor className="me-2" /> Về trang chủ
          </Button>

          <Button
            variant="outline-secondary"
            className="px-4 py-2"
            onClick={() => navigate("/orders")}
          >
            <Receipt className="me-2" /> Xem đơn hàng
          </Button>
        </motion.div>

        <p className="text-muted mt-4" style={{ fontSize: "0.9rem" }}>
          Bạn sẽ được chuyển hướng đến trang <strong>đơn hàng</strong> sau{" "}
          <span className="fw-semibold text-primary">5 giây...</span>
        </p>
      </Container>
    </div>
  );
};

export default CheckoutSuccess;
