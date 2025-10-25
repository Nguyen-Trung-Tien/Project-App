import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllProductApi } from "../../api/productApi";
import "./AllProducts.scss";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProductApi();

        if (res && res.errCode === 0) {
          setProducts(res.products || []);
        } else {
          toast.error("Không thể tải danh sách sản phẩm!");
        }
      } catch (err) {
        console.error("Fetch products error:", err);
        toast.error("Lỗi kết nối máy chủ!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <section className="all-products-section">
        <Container>
          <h2 className="section-title text-center mb-4 fw-bold">
            Tất cả sản phẩm
          </h2>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted">
              Không có sản phẩm nào được tìm thấy.
            </p>
          ) : (
            <Row className="g-4 justify-content-center">
              {products.map((product) => (
                <Col key={product.id} md={3} sm={6} xs={12}>
                  <ProductCard product={product} userId={userId} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default AllProducts;
