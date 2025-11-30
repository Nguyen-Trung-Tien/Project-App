import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import { filterProductsApi } from "../../api/productApi";
import ChatBot from "../../components/ChatBot/ChatBot";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
import "./ProductListPage.scss";

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 12;
  const categoryIdParam = searchParams.get("category") || "";

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters & pagination
  const fetchProducts = useCallback(
    async (page = 1, filters = {}, append = false) => {
      try {
        append ? setLoadingMore(true) : setLoading(true);
        setError("");

        const res = await filterProductsApi({
          brandId: filters.brands?.length > 0 ? filters.brands.join(",") : "",
          categoryId: filters.category || categoryIdParam || "",
          minPrice: filters.price?.[0] ?? 0,
          maxPrice: filters.price?.[1] ?? 60000000,
          sort: filters.sort || "",
          page,
          limit,
        });

        if (res.errCode === 0) {
          const newProducts = res.products || res.data || [];
          setProducts((prev) =>
            append ? [...prev, ...newProducts] : newProducts
          );
          setCurrentPage(res.currentPage || page);
          setTotalPages(res.totalPages || 1);
        } else {
          throw new Error(res.errMessage || "Lỗi tải sản phẩm");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm");
        if (!append) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categoryIdParam]
  );

  // Load initial products
  useEffect(() => {
    const initialFilters = appliedFilters.category
      ? { ...appliedFilters }
      : { ...appliedFilters, category: categoryIdParam };
    fetchProducts(1, initialFilters, false);
  }, [categoryIdParam, appliedFilters, fetchProducts]);

  const handleCategoryClick = (catId) => {
    const newParams = catId ? { category: catId } : {};
    setSearchParams(newParams);

    const newFilters = { ...appliedFilters, category: catId || "" };
    setAppliedFilters(newFilters);
    fetchProducts(1, newFilters, false);
  };

  const handleLoadMore = () => {
    if (currentPage >= totalPages || loadingMore) return;
    fetchProducts(currentPage + 1, appliedFilters, true);
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
    <section className="product-list-page py-3 bg-light">
      <Container>
        <ChatBot />

        {/* Category Filter Bar */}
        <div className="filter-bar mb-4 d-flex flex-wrap gap-2 align-items-center">
          {/* Product Filter */}
          <ProductFilter
            onFilterChange={(filters) => {
              setAppliedFilters(filters);
              fetchProducts(1, filters, false);
            }}
          />
          <span className="fw-semibold text-muted">Lọc theo:</span>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={
                (appliedFilters.category || categoryIdParam) == cat.id
                  ? "primary"
                  : "outline-secondary"
              }
              className="rounded-pill px-3"
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
          {(appliedFilters.category || categoryIdParam) && (
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

        {/* Error */}
        {error && (
          <Alert variant="danger" className="text-center mb-4">
            {error}
            <Button
              variant="link"
              size="sm"
              className="ms-2 p-0"
              onClick={() => fetchProducts(1, appliedFilters, false)}
            >
              Thử lại
            </Button>
          </Alert>
        )}

        {/* Loading Skeleton */}
        {loading && products.length === 0 && renderSkeletons()}

        {/* No products */}
        {!loading && !error && products.length === 0 && (
          <Alert variant="info" className="text-center">
            Không có sản phẩm nào.
          </Alert>
        )}

        {/* Product List */}
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

            {/* Load more */}
            {loadingMore && renderSkeletons(5)}
            {currentPage < totalPages && !loadingMore && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-3 py-2 shadow-sm"
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
