import React from "react";
import "./CartSkeleton.scss";

const CartSkeleton = () => {
  return (
    <div className="cart-skeleton p-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="skeleton-item d-flex align-items-center mb-3 p-3 bg-white rounded-3 shadow-sm"
        >
          <div className="skeleton-image bg-light rounded-3"></div>

          {/* Nội dung */}
          <div className="skeleton-content ms-3 flex-grow-1">
            <div className="skeleton-title bg-light rounded"></div>
            <div className="skeleton-price bg-light rounded mt-2"></div>
          </div>

          {/* Nút xóa */}
          <div className="skeleton-delete bg-light rounded-circle"></div>
        </div>
      ))}
    </div>
  );
};

export default CartSkeleton;
