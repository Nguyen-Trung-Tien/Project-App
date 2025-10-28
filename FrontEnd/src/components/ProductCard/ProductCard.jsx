import React, { useState, useMemo } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addCart, getAllCarts, createCart } from "../../api/cartApi";
import { addCartItem } from "../../redux/cartSlice";
import { getImage } from "../../utils/decodeImage";
import { CartPlus, CreditCard } from "react-bootstrap-icons";
import "./ProductCard.scss";
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const { id, name, price, discount, stock, sold, image, isActive } = product;

  const { rawPrice, finalPrice, hasDiscount } = useMemo(() => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    const discounted = d > 0 ? p * (1 - d / 100) : p;
    return {
      rawPrice: Math.round(p),
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

    setLoadingCart(true);
    try {
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }
      await addCart({ cartId: cart.id, productId: id, quantity: 1 });
      dispatch(addCartItem({ ...product, quantity: 1 }));
      toast.success(`Đã thêm "${name}" vào giỏ hàng`);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.warn("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    if (!isActive || stock < 1) {
      toast.error("Sản phẩm không khả dụng!");
      return;
    }

    setLoadingBuy(true);
    try {
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }
      await addCart({ cartId: cart.id, productId: id, quantity: 1 });
      dispatch(addCartItem({ ...product, quantity: 1 }));

      navigate("/checkout", { state: { product, quantity: 1 } });
    } catch (err) {
      console.error(err);
      toast.error("Không thể mua ngay, vui lòng thử lại!");
    } finally {
      setLoadingBuy(false);
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
        style={{ width: "100%", height: "150px" }}
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
            -{discount}%
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
          {hasDiscount && (
            <div className="text-muted text-decoration-line-through fs-6">
              {formatVND(rawPrice)}
            </div>
          )}
          <div className="text-danger fw-bold fs-5">
            {formatVND(finalPrice)}
          </div>
        </div>

        <div className="text-muted fs-6 mb-2">
          {stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
        </div>

        {sold !== undefined && (
          <div className="text-secondary fs-6 mb-2">
            Đã bán {sold.toLocaleString("vi-VN")}
          </div>
        )}

        <div className="d-flex gap-2 mt-auto shopee-buttons">
          <Button
            variant="outline-primary"
            disabled={!isActive || stock < 1 || loadingCart}
            onClick={handleAddToCart}
            className="flex-fill btn-shopee-add btn-shopee-small d-flex align-items-center justify-content-center"
          >
            {loadingCart ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <CartPlus className="me-1" />
              </>
            )}
          </Button>

          <Button
            disabled={!isActive || stock < 1 || loadingBuy}
            onClick={handleBuyNow}
            className="flex-fill btn-shopee-buy btn-shopee-small d-flex align-items-center justify-content-center"
          >
            {loadingBuy ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <CreditCard className="me-1" /> Mua ngay
              </>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
