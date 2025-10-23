import React, { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import imgPro from "../../assets/Product.jpg";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, name, price, discount, stock, image, isActive } = product;
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const getImage = (img) => {
    if (!img) return imgPro;
    if (typeof img === "string") return img;
    if (img.data) {
      try {
        const base64String = btoa(
          new Uint8Array(img.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return `data:image/jpeg;base64,${base64String}`;
      } catch {
        return imgPro;
      }
    }
    return imgPro;
  };

  const finalPrice = discount ? price * (1 - discount / 100) : Number(price);

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
      // Lấy tất cả cart của user
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);

      // Nếu chưa có cart, tạo mới
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }

      // Thêm sản phẩm vào cart
      const res = await addCart({
        cartId: cart.id,
        productId: id,
        quantity: 1,
      });

      if (res.errCode === 0) {
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
      className={`product-card shadow-sm ${!isActive ? "inactive" : ""}`}
      onClick={() => navigate(`/product-detail/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <div
        className="image-wrapper shadow-sm rounded bg-white p-2"
        style={{ maxWidth: "250px", margin: "0 auto" }}
      >
        <Card.Img
          variant="top"
          src={getImage(image)}
          alt={name}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
      </div>

      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <div className="price-section">
          {discount > 0 ? (
            <>
              <span className="old-price">{price.toLocaleString()}₫</span>
              <span className="final-price">
                {finalPrice.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="final-price">{finalPrice.toLocaleString()}₫</span>
          )}
        </div>

        <div className="d-grid mt-2">
          <Button
            variant="primary"
            disabled={!isActive || stock < 1 || loading}
            onClick={handleAddToCart}
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
