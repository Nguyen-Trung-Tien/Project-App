import React from "react";
import { Card } from "react-bootstrap";
import { getImage } from "../../utils/decodeImage";
import { Truck, BoxSeam, Wallet2 } from "react-bootstrap-icons";

const OrderSummary = ({ selectedItems, total }) => (
  <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
    <Card.Header
      className="bg-primary text-white fw-bold py-3 text-center"
      style={{
        background: "linear-gradient(90deg, #007bff 0%, #00b4d8 100%)",
      }}
    >
      <Wallet2 className="me-2 mb-1" size={18} />
      Tóm tắt đơn hàng
    </Card.Header>

    <Card.Body className="p-4">
      {selectedItems.map((item) => (
        <div
          key={item.id}
          className="d-flex align-items-center mb-3 pb-2 border-bottom"
        >
          <img
            src={getImage(item.product?.image) || "/no-image.jpg"}
            alt={item.product?.name}
            className="rounded me-3"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "1px solid #eee",
            }}
          />
          <div className="flex-grow-1">
            <p className="mb-1 fw-semibold text-dark small">
              {item.product?.name}
            </p>
            <small className="text-muted">
              {item.quantity} ×{" "}
              {(item.product?.discount
                ? (item.product.price * (100 - item.product.discount)) / 100
                : item.product.price
              ).toLocaleString()}
              ₫
            </small>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Tạm tính:</span>
          <span className="fw-semibold">{total.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">
            <Truck className="me-1 text-success" /> Phí vận chuyển:
          </span>
          <span className="fw-semibold text-success">Miễn phí</span>
        </div>

        <div className="d-flex justify-content-between border-top pt-3">
          <span className="fw-bold text-dark">Tổng cộng:</span>
          <span
            className="fw-bold"
            style={{
              color: "#007bff",
              fontSize: "1.1rem",
            }}
          >
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </Card.Body>

    <Card.Footer className="bg-light text-center py-3 small text-muted">
      <BoxSeam className="me-1" />
      Đảm bảo giao hàng nhanh & an toàn
    </Card.Footer>
  </Card>
);

export default OrderSummary;
