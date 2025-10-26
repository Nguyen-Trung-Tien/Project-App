import React, { useState, useMemo } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { getImage } from "../../utils/decodeImage";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const [loading, setLoading] = useState(false);

  const { id, name, price, discount, stock, image, isActive, sku, category } =
    product;

  const { rawPrice, rawDiscount, finalPrice, hasDiscount } = useMemo(() => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    const discounted = d > 0 ? p * (1 - d / 100) : p;

    return {
      rawPrice: Math.round(p),
      rawDiscount: d,
      finalPrice: Math.round(discounted),
      hasDiscount: d > 0,
    };
  }, [price, discount]);

  const formatVND = (value) =>
    value.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

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
      className={`product-card shadow-sm border-0 rounded-4 overflow-hidden ${
        !isActive ? "inactive" : ""
      }`}
      onClick={() => navigate(`/product-detail/${id}`)}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        className="image-wrapper position-relative bg-white"
        style={{
          width: "100%",
          height: "220px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card.Img
          variant="top"
          src={getImage(image)}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {hasDiscount && (
          <span
            className="discount-badge"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              fontWeight: "600",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.8rem",
            }}
          >
            -{rawDiscount}%
          </span>
        )}
      </div>

      <Card.Body
        className="d-flex flex-column justify-content-between"
        style={{ padding: "0.75rem 1rem" }}
      >
        <div>
          <Card.Title
            className="mb-2 text-truncate"
            title={name}
            style={{ fontWeight: 600, fontSize: "1rem" }}
          >
            {name}
          </Card.Title>

          {/* ✅ Giá hiển thị rõ ràng, đẹp mắt */}
          <div className="price-section mb-2">
            {hasDiscount ? (
              <>
                <div
                  className="text-muted"
                  style={{ textDecoration: "line-through", fontSize: "0.9rem" }}
                >
                  {formatVND(rawPrice)}
                </div>
                <div
                  style={{
                    color: "#d0021b",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatVND(finalPrice)}
                </div>
              </>
            ) : (
              <div
                style={{
                  color: "#d0021b",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {formatVND(finalPrice)}
              </div>
            )}
          </div>

          <div className="small text-secondary">
            <div>
              <strong>Mã:</strong> {sku || "—"}
            </div>
            <div>
              <strong>Danh mục:</strong> {category?.name || "Không có"}
            </div>
            <div>
              <strong>Tồn kho:</strong> {stock}
            </div>
          </div>
        </div>

        <div className="d-grid mt-3">
          <Button
            variant="primary"
            disabled={!isActive || stock < 1 || loading}
            onClick={handleAddToCart}
            style={{
              borderRadius: 50,
              backgroundColor: "#007bff",
              fontWeight: 500,
            }}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "🛒 Thêm vào giỏ"
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
