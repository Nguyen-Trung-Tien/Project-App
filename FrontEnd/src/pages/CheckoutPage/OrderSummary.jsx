import React from "react";
import { Card } from "react-bootstrap";
import { getImage } from "../../utils/decodeImage";

const OrderSummary = ({ selectedItems, total }) => (
  <Card className="p-3 shadow-sm border-0">
    <h5 className="fw-bold text-secondary mb-3">Tóm tắt đơn hàng</h5>
    {selectedItems.map((item) => (
      <div key={item.id} className="d-flex align-items-center mb-3">
        <img
          src={getImage(item.product?.image) || "/no-image.jpg"}
          alt={item.product?.name}
          className="checkout-img me-3"
        />
        <div className="flex-grow-1">
          <p className="mb-1 fw-semibold">{item.product?.name}</p>
          <small className="text-muted">
            {item.quantity} x{" "}
            {(item.product?.discount
              ? (item.product.price * (100 - item.product.discount)) / 100
              : item.product.price
            ).toLocaleString()}
            ₫
          </small>
        </div>
      </div>
    ))}
    <hr />
    <p className="fw-semibold d-flex justify-content-between">
      Tạm tính: <span>{total.toLocaleString()}₫</span>
    </p>
    <p className="fw-semibold d-flex justify-content-between">
      Phí vận chuyển: <span className="text-success">Miễn phí</span>
    </p>
    <hr />
    <h5 className="fw-bold d-flex justify-content-between text-primary">
      Tổng cộng: <span>{total.toLocaleString()}₫</span>
    </h5>
  </Card>
);

export default OrderSummary;
