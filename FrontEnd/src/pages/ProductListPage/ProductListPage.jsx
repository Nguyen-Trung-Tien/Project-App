import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import {
  getAllProductApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import ChatBot from "../../components/ChatBot/ChatBot";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import "./ProductListPage.scss";

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 10;

  const categoryId = searchParams.get("category") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) {
          setCategories(res.data || []);
        } else {
          setError("Không thể tải danh mục");
        }
      } catch (err) {
        console.error("Lỗi load danh mục:", err);
        setError("Lỗi kết nối");
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(
    async (page = 1, catId = "", append = false) => {
      try {
        append ? setLoadingMore(true) : setLoading(true);
        setError("");

        let res;
        if (catId) {
          res = await getProductsByCategoryApi(catId, page, limit);
        } else {
          res = await getAllProductApi(page, limit);
        }

        if (res?.errCode === 0) {
          const newProducts = res.products || [];
          setProducts((prev) =>
            append ? [...prev, ...newProducts] : newProducts
          );
          setCurrentPage(res.currentPage || page);
          setTotalPages(res.totalPages || 1);
        } else {
          throw new Error(res?.errMessage || "Lỗi tải sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi fetch sản phẩm:", err);
        setError("Không thể tải sản phẩm");
        if (!append) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchProducts(1, categoryId, false);
  }, [categoryId, fetchProducts]);

  const handleCategoryClick = (catId) => {
    const newParams = catId ? { category: catId } : {};
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
    if (currentPage >= totalPages || loadingMore) return;
    fetchProducts(currentPage + 1, categoryId, true);
  };

  const renderSkeletons = (count = limit) => (
    <Row className="g-3 justify-content-center">
      {Array.from({ length: count }).map((_, i) => (
        <Col
          key={`sk-${i}`}
          lg={2}
          md={3}
          sm={6}
          xs={12}
          className="d-flex justify-content-center"
        >
          <SkeletonCard />
        </Col>
      ))}
    </Row>
  );

  return (
    <section className="product-list-page py-5 bg-light">
      <Container>
        <ChatBot />

        <h3 className="section-title text-center mb-5 fw-bold fs-2">
          Danh sách sản phẩm
        </h3>

        <div className="filter-bar mb-4 d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-semibold text-muted">Lọc theo:</span>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={categoryId === cat.id ? "primary" : "outline-secondary"}
              className="rounded-pill px-3"
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
          {categoryId && (
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleCategoryClick("")}
            >
              Xóa lọc
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="danger" className="text-center mb-4">
            {error}
            <Button
              variant="link"
              size="sm"
              className="ms-2 p-0"
              onClick={() => fetchProducts(1, categoryId, false)}
            >
              Thử lại
            </Button>
          </Alert>
        )}

        {loading && products.length === 0 && renderSkeletons()}

        {!loading && !error && products.length === 0 && (
          <Alert variant="info" className="text-center">
            Không có sản phẩm nào trong danh mục này.
          </Alert>
        )}

        {products.length > 0 && (
          <>
            <Row className="g-3 justify-content-center">
              {products.map((product) => (
                <Col
                  key={product.id}
                  lg={2}
                  md={3}
                  sm={6}
                  xs={12}
                  className="d-flex justify-content-center"
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {loadingMore && renderSkeletons(5)}
            {currentPage < totalPages && !loadingMore && (
              <div className="text-center mt-5">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill px-5 py-2 shadow-sm"
                  onClick={handleLoadMore}
                >
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};

export default ProductListPage;
