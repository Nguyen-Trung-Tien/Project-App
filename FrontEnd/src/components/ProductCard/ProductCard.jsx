import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, name, price, discount, stock, image, category, isActive } =
    product;

  let imageUrl = "/default-product.jpg";
  if (image) {
    try {
      if (typeof image === "string") {
        imageUrl = image;
      } else if (image.data) {
        const base64String = btoa(
          new Uint8Array(image.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        imageUrl = `data:image/jpeg;base64,${base64String}`;
      }
    } catch (e) {
      console.error("Lỗi xử lý hình ảnh:", e);
    }
  }

  const finalPrice = discount
    ? (price * (1 - discount / 100)).toFixed(0)
    : Number(price).toFixed(0);

  return (
    <Card
      className={`product-card shadow-sm ${!isActive ? "inactive" : ""}`}
      onClick={() => navigate(`/product-detail/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="image-wrapper">
        <Card.Img variant="top" src={imageUrl} alt={name} />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
      </div>

      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <div className="price-section">
          {discount > 0 ? (
            <>
              <span className="old-price">{price}₫</span>
              <span className="final-price">{finalPrice}₫</span>
            </>
          ) : (
            <span className="final-price">{finalPrice}₫</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
