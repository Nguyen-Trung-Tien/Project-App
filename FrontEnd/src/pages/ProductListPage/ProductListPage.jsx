import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import {
  getAllProductApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import "./ProductListPage.scss";

// Skeleton card
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
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 12;

  // Fetch categories
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

  // Fetch products
  const fetchProducts = async (
    page = 1,
    catIds = [],
    append = false,
    search = ""
  ) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError("");

      let res;

      // Không gọi API với category rỗng
      if (catIds.length === 0) {
        // Gọi API tất cả sản phẩm (có search)
        res = await getAllProductApi(page, limit, search);
      } else {
        // Chỉ gửi category đầu tiên (API chỉ hỗ trợ 1 category)
        res = await getProductsByCategoryApi(catIds[0], page, limit, search);
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

  // Đọc query từ URL
  useEffect(() => {
    const catIdFromQuery = searchParams.get("category") || "";
    const searchFromQuery = searchParams.get("search") || "";

    setSelectedCategories(catIdFromQuery ? [catIdFromQuery] : []);
    setSearchQuery(searchFromQuery);

    fetchProducts(
      1,
      catIdFromQuery ? [catIdFromQuery] : [],
      false,
      searchFromQuery
    );
  }, [searchParams]);

  // Debounce helper
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Category change debounce
  const handleCategoryChange = useCallback(
    debounce((value) => {
      const params = {};
      if (value.length) params.category = value[0]; // chỉ category đầu tiên
      if (searchQuery) params.search = searchQuery;
      setSearchParams(params);
      fetchProducts(1, value, false, searchQuery);
    }, 300),
    [searchQuery]
  );

  const toggleCategory = (id) => {
    let updated = [];
    if (selectedCategories.includes(id)) {
      updated = selectedCategories.filter((c) => c !== id);
    } else {
      updated = [id]; // chỉ 1 category
    }
    setSelectedCategories(updated);
    handleCategoryChange(updated);
  };

  // Search input change debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const params = {};
    if (selectedCategories.length) params.category = selectedCategories[0];
    if (value) params.search = value;
    setSearchParams(params);

    debounce(() => fetchProducts(1, selectedCategories, false, value), 300)();
  };

  // Load more
  const handleLoadMore = () => {
    if (currentPage >= totalPages) return;
    fetchProducts(currentPage + 1, selectedCategories, true, searchQuery);
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4">Danh sách sản phẩm</h3>

      {/* Search */}
      <div className="mb-3">
        <InputGroup>
          <FormControl
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            variant="primary"
            onClick={() =>
              fetchProducts(1, selectedCategories, false, searchQuery)
            }
          >
            Tìm
          </Button>
        </InputGroup>
      </div>

      {/* Category Filter */}
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
            onClick={() =>
              setSelectedCategories([]) ||
              fetchProducts(1, [], false, searchQuery)
            }
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
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {currentPage < totalPages && (
            <div className="text-center mt-4">
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
