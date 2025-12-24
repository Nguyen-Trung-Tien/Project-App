import React from "react";
import { Card } from "react-bootstrap";
import { Truck, BoxSeam, Wallet2 } from "react-bootstrap-icons";
import { getImage } from "../../utils/decodeImage";
import "./OrderSummary.scss";

const OrderSummary = ({ selectedItems, total }) => {
  return (
    <Card className="order-summary-card">
      {/* HEADER */}
      <div className="order-summary-header">
        <Wallet2 size={18} />
        <span>Tóm tắt đơn hàng</span>
      </div>

      {/* BODY */}
      <div className="order-summary-body">
        {selectedItems.map((item) => {
          const price = item.product?.discount
            ? (item.product.price * (100 - item.product.discount)) / 100
            : item.product.price;

          return (
            <div key={item.id} className="summary-item">
              <img src={getImage(item.product.image)} alt={item.product.name} />

              <div className="summary-item-info">
                <div className="name">{item.product.name}</div>
                <div className="qty">
                  {item.quantity} × {price.toLocaleString("vi-VN")}₫
                </div>
              </div>

              <div className="summary-item-price">
                {(price * item.quantity).toLocaleString("vi-VN")}₫
              </div>
            </div>
          );
        })}

        {/* TOTAL */}
        <div className="summary-total">
          <div className="row">
            <span>Tạm tính</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>

          <div className="row shipping">
            <span>
              <Truck /> Vận chuyển
            </span>
            <span>Miễn phí</span>
          </div>

          <div className="row grand-total">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="order-summary-footer">
        <BoxSeam />
        <span>Giao hàng nhanh – An toàn – Đổi trả dễ dàng</span>
      </div>
    </Card>
  );
};

export default OrderSummary;
