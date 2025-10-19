import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card shadow-sm">
      <Card.Img variant="top" src={product.image} alt={product.title} />
      <Card.Body>
        <Card.Title className="product-card__title">{product.title}</Card.Title>
        <Card.Text className="product-card__price">
          {product.price.toLocaleString()}₫
        </Card.Text>
        <Button variant="outline-primary" size="sm">
          Thêm vào giỏ
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
