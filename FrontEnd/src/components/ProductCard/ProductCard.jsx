import React, { useState, useMemo } from "react";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { addCartItem } from "../../redux/cartSlice";
import { getImage } from "../../utils/decodeImage";
import {
  CartPlus,
  CreditCard,
  Star,
  StarFill,
  StarHalf,
} from "react-bootstrap-icons";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const token = user?.accessToken;

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const {
    id,
    name,
    price,
    discount = 0,
    stock,
    sold,
    image,
    isActive,
    reviews = [],
  } = product;

  /* ===== Rating ===== */
  const { avgRating, totalReviews } = useMemo(() => {
    if (!reviews.length) return { avgRating: 0, totalReviews: 0 };
    const avg =
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    return { avgRating: avg, totalReviews: reviews.length };
  }, [reviews]);

  /* ===== Price ===== */
  const { rawPrice, finalPrice, hasDiscount } = useMemo(() => {
    const p = Number(price) || 0;
    const discounted = discount > 0 ? p * (1 - discount / 100) : p;
    return {
      rawPrice: Math.round(p),
      finalPrice: Math.round(discounted),
      hasDiscount: discount > 0,
    };
  }, [price, discount]);

  const formatVND = (v) =>
    v.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

  /* ===== Actions ===== */
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) return toast.warn("Bạn cần đăng nhập!");
    if (!isActive || stock < 1) return toast.error("Sản phẩm không khả dụng!");

    setLoadingCart(true);
    try {
      const cartsRes = await getAllCarts(token);
      let cart = cartsRes?.data?.find((c) => c.userId === userId);

      if (!cart) {
        const newCartRes = await createCart(userId, token);
        cart = newCartRes.data;
      }

      const res = await addCart(
        { cartId: cart.id, productId: id, quantity: 1 },
        token
      );

      dispatch(
        addCartItem({
          id: res.data.id,
          product: res.data.product,
          quantity: res.data.quantity,
        })
      );

      toast.success(`Đã thêm "${name}" vào giỏ hàng`);
    } catch {
      toast.error("Thêm vào giỏ thất bại!");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!userId) return toast.warn("Vui lòng đăng nhập!");
    if (!isActive || stock < 1) return toast.error("Sản phẩm không khả dụng!");
    setLoadingBuy(true);
    navigate("/checkout", { state: { product, quantity: 1 } });
  };

  return (
    <Card
      className={`product-card-v2 ${!isActive ? "disabled" : ""}`}
      onClick={() => navigate(`/product-detail/${id}`)}
    >
      {/* IMAGE */}
      <div className="image-box">
        <img src={getImage(image)} alt={name} />
        {hasDiscount && <Badge className="discount-badge">-{discount}%</Badge>}
      </div>

      <Card.Body className="content">
        {/* NAME */}
        <h6 className="product-name" title={name}>
          {name}
        </h6>

        {/* PRICE */}
        <div className="price">
          {hasDiscount && (
            <span className="old-price">{formatVND(rawPrice)}</span>
          )}
          <span className="final-price">{formatVND(finalPrice)}</span>
        </div>

        {/* META */}
        <div className="meta">
          <span>{stock > 0 ? `Còn ${stock}` : "Hết hàng"}</span>
          {sold !== undefined && <span>Đã bán {sold}</span>}
        </div>

        {/* RATING */}
        {totalReviews > 0 && (
          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => {
              const star = i + 1;
              return avgRating >= star ? (
                <StarFill key={i} />
              ) : avgRating >= star - 0.5 ? (
                <StarHalf key={i} />
              ) : (
                <Star key={i} />
              );
            })}
            <span>({totalReviews})</span>
          </div>
        )}

        {/* FREE SHIP */}
        {finalPrice >= 500000 && (
          <span className="free-ship">Miễn phí vận chuyển</span>
        )}

        {/* ACTIONS */}
        <div className="actions">
          <Button
            variant="outline-primary"
            disabled={!isActive || stock < 1 || loadingCart}
            onClick={handleAddToCart}
          >
            {loadingCart ? <Spinner size="sm" /> : <CartPlus size={20} />}
          </Button>

          <Button
            variant="outline-success"
            disabled={!isActive || stock < 1 || loadingBuy}
            onClick={handleBuyNow}
          >
            {loadingBuy ? (
              <Spinner size="sm" />
            ) : (
              <>
                <CreditCard size={20} />
                <span style={{ fontSize: "0.85rem", marginLeft: 4 }}>
                  Mua ngay
                </span>
              </>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
