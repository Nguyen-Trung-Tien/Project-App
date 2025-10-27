import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { XCircleFill, HouseDoor, ArrowClockwise } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import "./CheckoutFailed.scss";

const CheckoutFailed = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    document.title = "Thanh toán thất bại - EShop";
  }, []);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center"
      style={{ maxWidth: "600px" }}
    >
      <XCircleFill color="#dc3545" size={100} className="mb-4" />
      <h2 className="fw-bold text-danger mb-3">Thanh toán thất bại</h2>
      <p className="text-muted mb-4">
        Rất tiếc, giao dịch của bạn không thành công.
        <br />
        {orderId
          ? `Mã đơn hàng: ${orderId}`
          : "Vui lòng thử lại hoặc chọn phương thức thanh toán khác."}
      </p>

      <div className="d-flex gap-3 justify-content-center">
        <Button
          variant="outline-danger"
          className="rounded-pill px-4 py-2"
          onClick={() => navigate(-1)}
        >
          <ArrowClockwise className="me-2" /> Thử lại
        </Button>

        <Button
          variant="primary"
          className="rounded-pill px-4 py-2"
          onClick={() => navigate("/")}
        >
          <HouseDoor className="me-2" /> Về trang chủ
        </Button>
      </div>
    </Container>
  );
};

export default CheckoutFailed;
