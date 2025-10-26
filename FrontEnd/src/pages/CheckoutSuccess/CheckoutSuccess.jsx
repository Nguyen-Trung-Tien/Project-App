import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { CheckCircleFill, HouseDoor, Receipt } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
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
        <div className="success-icon text-success">
          <CheckCircleFill size={90} />
        </div>

        <h2 className="mt-3 fw-bold text-success">Thanh toán thành công!</h2>
        <p className="text-muted mt-2">
          Cảm ơn bạn đã mua hàng tại <strong>T-Store</strong>.<br />
          Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>

        <div className="order-info mt-4">
          <h6>Mã đơn hàng của bạn:</h6>
          <p className="order-code fw-bold text-primary">
            #
            {orderId
              ? `DH${orderId}`
              : `ESTORE${Math.floor(Math.random() * 1000000)}`}
          </p>
        </div>

        <div className="mt-5 d-flex justify-content-center gap-3 flex-wrap">
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
        </div>

        <p className="text-muted mt-4" style={{ fontSize: "0.9rem" }}>
          Bạn sẽ được chuyển hướng đến trang đơn hàng sau 5 giây...
        </p>
      </Container>
    </div>
  );
};

export default CheckoutSuccess;
