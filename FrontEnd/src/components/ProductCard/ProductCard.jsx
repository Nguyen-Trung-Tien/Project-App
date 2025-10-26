import React, { useState, useMemo } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { addCartItem } from "../../redux/cartSlice";
import { getImage } from "../../utils/decodeImage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const [loading, setLoading] = useState(false);

  const { id, name, price, discount, stock, image, isActive } = product;

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

      if (res.errCode === 0) {
        dispatch(addCartItem({ ...product, quantity: 1 }));
        toast.success(`Đã thêm "${name}" vào giỏ hàng`);
      } else {
        toast.error(res.errMessage || "Thêm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      console.error("Error adding cart item:", err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`product-card shadow-sm border-0 rounded-3 overflow-hidden ${
        !isActive ? "opacity-75" : ""
      } h-100`}
      onClick={() => navigate(`/product-detail/${id}`)}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        maxWidth: "200px",
        minWidth: "200px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="image-wrapper position-relative bg-white d-flex align-items-center justify-content-center"
        style={{
          width: "100%",
          height: "150px",
        }}
      >
        <Card.Img
          variant="top"
          src={getImage(image)}
          alt={name}
          className="p-2"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {hasDiscount && (
          <span
            className="position-absolute top-0 start-0 bg-danger text-white fw-bold px-2 py-1 rounded-bottom-end"
            style={{ fontSize: "0.75rem" }}
          >
            -{rawDiscount}%
          </span>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <Card.Title
          className="mb-2 text-truncate-2-lines"
          title={name}
          style={{ fontSize: "0.9rem", minHeight: "2.4rem" }}
        >
          {name}
        </Card.Title>

        <div className="price-section mb-2">
          {hasDiscount ? (
            <>
              <div className="text-muted text-decoration-line-through fs-6">
                {formatVND(rawPrice)}
              </div>
              <div className="text-danger fw-bold fs-5">
                {formatVND(finalPrice)}
              </div>
            </>
          ) : (
            <div className="text-danger fw-bold fs-5">
              {formatVND(finalPrice)}
            </div>
          )}
        </div>

        <div className="text-muted fs-6 mb-2">
          Đã bán: {stock > 0 ? stock : "Hết hàng"}
        </div>

        <Button
          variant="outline-primary"
          disabled={!isActive || stock < 1 || loading}
          onClick={handleAddToCart}
          className="mt-auto rounded-pill"
          style={{
            fontSize: "0.85rem",
            padding: "0.5rem",
          }}
        >
          {loading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <>
              <i className="bi bi-cart-plus me-1"></i> Thêm vào giỏ
            </>
          )}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
