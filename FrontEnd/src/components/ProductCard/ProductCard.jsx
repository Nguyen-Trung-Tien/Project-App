import React, { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import "./ProductCard.scss";
import { getImage } from "../../utils/decodeImage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, name, price, discount, stock, image, isActive, sku, category } =
    product;

  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const rawPrice = Number(price);
  const rawDiscount = Number(discount);
  const finalPrice =
    rawDiscount > 0 ? rawPrice * (1 - rawDiscount / 100) : rawPrice;

  const formatVND = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    if (!isActive || stock < 1) {
      toast.error("Sản phẩm không khả dụng!");
      return;
    }

    setLoading(true);
    try {
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }
      const res = await addCart({
        cartId: cart.id,
        productId: id,
        quantity: 1,
      });
      if (res.errCode === 0) toast.success(`Đã thêm "${name}" vào giỏ hàng`);
      else toast.error(res.errMessage || "Thêm vào giỏ hàng thất bại!");
    } catch (err) {
      console.error("Error adding cart item:", err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`product-card shadow-sm ${!isActive ? "inactive" : ""}`}
      onClick={() => navigate(`/product-detail/${id}`)}
    >
      <div
        className="image-wrapper shadow-sm rounded bg-white p-2"
        style={{ flex: "0 0 200px", position: "relative" }}
      >
        <Card.Img
          variant="top"
          src={getImage(image)}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        {rawDiscount > 0 && (
          <span
            className="discount-badge"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              fontWeight: "bold",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "0.8rem",
            }}
          >
            -{rawDiscount}%
          </span>
        )}
      </div>

      <Card.Body
        className="text-start d-flex flex-column justify-content-between"
        style={{ flex: "1 1 auto", padding: "0.75rem 1rem" }}
      >
        <div>
          <Card.Title className="mb-2" style={{ fontWeight: 600 }}>
            {name}
          </Card.Title>

          <div
            className="price-section mb-2"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {rawDiscount > 0 ? (
              <>
                <div
                  className="old-price"
                  style={{ textDecoration: "line-through", color: "#999" }}
                >
                  {formatVND(rawPrice)}
                </div>
                <div
                  className="final-price"
                  style={{ color: "#d0021b", fontWeight: "bold" }}
                >
                  {formatVND(finalPrice)}
                </div>
              </>
            ) : (
              <div
                className="final-price"
                style={{ color: "#d0021b", fontWeight: "bold" }}
              >
                {formatVND(finalPrice)}
              </div>
            )}
          </div>

          <div className="mb-1">
            <strong>Mã sản phẩm:</strong> {sku || "—"}
          </div>
          <div className="mb-1">
            <strong>Danh mục:</strong> {category?.name || "Không có"}
          </div>
          <div className="mb-1">
            <strong>Số lượng:</strong> {stock} sản phẩm
          </div>
        </div>

        <div className="d-grid mt-2">
          <Button
            variant="primary"
            disabled={!isActive || stock < 1 || loading}
            onClick={handleAddToCart}
            style={{ borderRadius: 50 }}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Thêm vào giỏ"
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
