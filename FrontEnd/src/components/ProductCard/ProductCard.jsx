import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const { title, price, image } = product;

  return (
    <Card className="product-card shadow-sm">
      <div className="product-card__img">
        <Card.Img variant="top" src={image} alt={title} />
      </div>
      <Card.Body className="text-center">
        <Card.Title className="product-card__title">{title}</Card.Title>
        <Card.Text className="product-card__price">
          {price.toLocaleString("vi-VN")}₫
        </Card.Text>
        <Button variant="primary" className="w-100">
          Thêm vào giỏ
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
