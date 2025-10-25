import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductListPage.scss";
import { getAllCategoryApi } from "../../api/CategoryApi";
import { getAllProductApi } from "../../api/productApi";
import Loading from "../../components/Loading/Loading";

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, prodRes] = await Promise.all([
          getAllCategoryApi(),
          getAllProductApi(),
        ]);
        setCategories(catRes?.data || []);
        setProducts(prodRes?.products || []);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <Container className="py-4">
      <h3 className="mb-4">Danh sách sản phẩm</h3>

      {products.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="warning">Không có sản phẩm nào!</Alert>
      )}
    </Container>
  );
};

export default ProductListPage;
