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
    <div className="checkout-failed-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="failed-card">
          {/* ICON */}
          <div className="failed-icon">
            <XCircleFill />
          </div>

          {/* TITLE */}
          <h2 className="failed-title">Thanh toán thất bại</h2>

          {/* DESCRIPTION */}
          <p className="failed-desc">
            Rất tiếc, giao dịch của bạn không thể hoàn tất.
            <br />
            {orderId ? (
              <>
                Mã đơn hàng: <strong>#{orderId}</strong>
              </>
            ) : (
              "Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
            )}
          </p>

          {/* ACTIONS */}
          <div className="action-group">
            <Button
              variant="outline-danger"
              className="btn-sub"
              onClick={() => navigate(-1)}
            >
              <ArrowClockwise /> Thử lại
            </Button>

            <Button
              variant="primary"
              className="btn-main"
              onClick={() => navigate("/")}
            >
              <HouseDoor /> Trang chủ
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutFailed;
