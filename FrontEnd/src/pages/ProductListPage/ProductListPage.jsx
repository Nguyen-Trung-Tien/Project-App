import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import {
  getAllProductApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import "./ProductListPage.scss";

const SkeletonCard = () => (
  <Card className="p-3 mb-3 shadow-sm skeleton-card">
    <div className="skeleton-image mb-3" />
    <div className="skeleton-text mb-2" />
    <div className="skeleton-text w-50" />
  </Card>
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
  const limit = 12;

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
    <Container className="py-4">
      <h3 className="mb-4">Danh sách sản phẩm</h3>
      <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
        <span className="fw-bold me-2">Lọc theo danh mục:</span>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={
              selectedCategories.includes(cat.id)
                ? "primary"
                : "outline-secondary"
            }
            className="rounded-pill"
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
        {selectedCategories.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            className="ms-2 rounded-pill"
            onClick={() => setSelectedCategories([]) || fetchProducts(1, [])}
          >
            Clear All
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && products.length === 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <Col key={idx}>
              <SkeletonCard />
            </Col>
          ))}
        </Row>
      ) : products.length > 0 ? (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.map((product, index) => (
              <Col key={`${product.id}-${index}`}>
                <div className="product-card-wrapper">
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>

          {currentPage < totalPages && (
            <div className="text-center mt-2">
              <Button
                size="lg"
                variant="outline-primary"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tải...
                  </>
                ) : (
                  "Xem thêm"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Alert variant="warning">Không có sản phẩm nào!</Alert>
      )}
    </Container>
  );
};

export default ProductListPage;
