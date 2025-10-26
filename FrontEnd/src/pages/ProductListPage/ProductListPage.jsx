import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import {
  getAllProductApi,
  getProductsByCategoryApi,
} from "../../api/productApi";

const SkeletonCard = () => (
  <div
    className="product-card shadow-sm border-0 rounded-3 overflow-hidden bg-white"
    style={{ maxWidth: "220px", height: "300px" }}
  >
    <div
      className="bg-secondary bg-opacity-10 rounded mb-3"
      style={{ width: "100%", height: "180px" }}
    />
    <div className="p-3">
      <div
        className="bg-secondary bg-opacity-10 rounded mb-2"
        style={{ height: "20px" }}
      />
      <div
        className="bg-secondary bg-opacity-10 rounded w-50"
        style={{ height: "20px" }}
      />
    </div>
  </div>
);

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data || []);
        else setError("Lỗi khi load danh mục");
      } catch (err) {
        console.error(err);
        setError("Lỗi khi load danh mục");
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (page = 1, catIds = [], append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError("");

      let res;
      if (catIds.length === 0) {
        res = await getAllProductApi(page, limit);
      } else {
        res = await getProductsByCategoryApi(catIds[0], page, limit);
      }

      if (res?.errCode === 0) {
        const newProducts = res.products || [];
        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts
        );
        setCurrentPage(res.currentPage || page);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.errMessage || "Lỗi khi load sản phẩm");
        if (!append) setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi load sản phẩm");
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const catIdFromQuery = searchParams.get("category") || "";
    setSelectedCategories(catIdFromQuery ? [catIdFromQuery] : []);
    fetchProducts(1, catIdFromQuery ? [catIdFromQuery] : []);
  }, [searchParams]);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const handleCategoryChange = useCallback(
    debounce((value) => {
      const params = {};
      if (value.length) params.category = value[0];
      setSearchParams(params);
      fetchProducts(1, value);
    }, 300),
    []
  );

  const toggleCategory = (id) => {
    let updated = [];
    if (selectedCategories.includes(id)) {
      updated = selectedCategories.filter((c) => c !== id);
    } else {
      updated = [id];
    }
    setSelectedCategories(updated);
    handleCategoryChange(updated);
  };

  const handleLoadMore = () => {
    if (currentPage >= totalPages) return;
    fetchProducts(currentPage + 1, selectedCategories, true);
  };

  return (
    <section className="product-list-section py-5 bg-light">
      <Container>
        <h3 className="mb-5 fw-bold fs-3 text-center">Danh sách sản phẩm</h3>

        <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-bold me-3">Lọc theo danh mục:</span>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={
                selectedCategories.includes(cat.id)
                  ? "primary"
                  : "outline-secondary"
              }
              className="rounded-pill px-3"
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
          {selectedCategories.length > 0 && (
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => {
                setSelectedCategories([]);
                setSearchParams({});
                fetchProducts(1, []);
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {loading && products.length === 0 ? (
          <Row xs={1} sm={2} md={3} lg={5} className="g-3">
            {Array.from({ length: limit }).map((_, idx) => (
              <Col key={idx} className="d-flex justify-content-center">
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : products.length > 0 ? (
          <>
            <Row xs={1} sm={2} md={3} lg={5} className="g-3">
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

            {currentPage < totalPages && (
              <div className="text-center mt-5">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill px-4 py-2"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tải...
                    </>
                  ) : (
                    "Xem thêm sản phẩm"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Alert variant="warning" className="text-center">
            Không có sản phẩm nào phù hợp!
          </Alert>
        )}
      </Container>
    </section>
  );
};

export default ProductListPage;
