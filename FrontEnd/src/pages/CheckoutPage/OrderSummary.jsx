import React from "react";
import { Card } from "react-bootstrap";
import { getImage } from "../../utils/decodeImage";
import { Truck, BoxSeam, Wallet2 } from "react-bootstrap-icons";

const OrderSummary = ({ selectedItems, total }) => {
  return (
    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
      {/* ===== HEADER ===== */}
      <Card.Header
        className="text-white fw-bold py-3 text-center"
        style={{
          background: "#0d6efd",
        }}
      >
        <Wallet2 className="me-2 mb-1" size={18} />
        Tóm tắt đơn hàng
      </Card.Header>

      {/* ===== BODY ===== */}
      <Card.Body className="p-4">
        {selectedItems.map((item) => {
          const price = item.product?.discount
            ? (item.product.price * (100 - item.product.discount)) / 100
            : item.product?.price || 0;

          return (
            <div
              key={item.id}
              className="d-flex align-items-center mb-3 pb-3 border-bottom"
            >
              <img
                src={getImage(item.product?.image) || "/no-image.jpg"}
                alt={item.product?.name}
                className="me-3"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #e5e5e5",
                }}
              />

              <div className="flex-grow-1">
                <div className="fw-semibold text-dark small mb-1">
                  {item.product?.name}
                </div>
                <div className="text-muted small">
                  {item.quantity} × {price.toLocaleString("vi-VN")}₫
                </div>
              </div>

              <div className="fw-semibold text-end text-primary small">
                {(price * item.quantity).toLocaleString("vi-VN")}₫
              </div>
            </div>
          );
        })}

        {/* ===== PRICE SUMMARY ===== */}
        <div className="pt-2">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Tạm tính</span>
            <span className="fw-semibold">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">
              <Truck className="me-1 text-success" />
              Phí vận chuyển
            </span>
            <span className="fw-semibold text-success">Miễn phí</span>
          </div>

          <div className="d-flex justify-content-between border-top pt-3 mt-3">
            <span className="fw-bold">Tổng cộng</span>
            <span
              className="fw-bold"
              style={{ color: "#0d6efd", fontSize: "1.15rem" }}
            >
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </Card.Body>

      {/* ===== FOOTER ===== */}
      <Card.Footer className="bg-light text-center py-3 small text-muted">
        <BoxSeam className="me-1" />
        Đảm bảo giao hàng nhanh & an toàn
      </Card.Footer>
    </Card>
  );
};

export default OrderSummary;
