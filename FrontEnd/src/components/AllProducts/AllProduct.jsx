import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import { getAllProductApi, searchProductsApi } from "../../api/productApi";
import "./AllProducts.scss";

const AllProducts = React.memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);
  const limit = 12;

  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const fetchProducts = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        if (append) setLoadingMore(true);
        else {
          setLoading(true);
          setError(false);
        }

        const res = searchQuery
          ? await searchProductsApi(searchQuery, currentPage, limit)
          : await getAllProductApi(currentPage, limit);

        if (res?.errCode === 0) {
          const newProducts = res.products || [];
          setProducts((prev) =>
            append ? [...prev, ...newProducts] : newProducts
          );
          setTotalPages(res.totalPages || 1);
          setPage(currentPage);
        } else {
          throw new Error(res?.errMessage || "Lỗi tải sản phẩm");
        }
      } catch (err) {
        console.error("Fetch products error:", err);
        setError(true);
        toast.error("Không thể tải sản phẩm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, limit]
  );

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setError(false);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    if (page >= totalPages || loadingMore) return;
    fetchProducts(page + 1, true);
  };

  const renderSkeletons = (count = 10) => (
    <Row className="g-3 justify-content-center">
      {Array.from({ length: count }).map((_, i) => (
        <Col
          key={`skeleton-${i}`}
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
    <section className="all-products-section py-3 bg-light">
      <Container>
        <h2 className="section-title text-center mb-3 fw-bold fs-3">
          {searchQuery
            ? `Kết quả tìm kiếm: "${searchQuery}"`
            : "Tất cả sản phẩm"}
        </h2>

        {error && (
          <Alert variant="danger" className="text-center">
            Đã có lỗi xảy ra. Vui lòng tải lại trang.
            <Button
              variant="link"
              size="sm"
              className="ms-2 p-0"
              onClick={() => fetchProducts(1, false)}
            >
              Thử lại
            </Button>
          </Alert>
        )}

        {loading && !products.length && !error && renderSkeletons()}

        {!loading && !error && products.length === 0 && (
          <Alert variant="warning" className="text-center">
            Không tìm thấy sản phẩm nào phù hợp.
          </Alert>
        )}

        {!loading && !error && products.length > 0 && (
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
                  <ProductCard product={product} userId={userId} />
                </Col>
              ))}
            </Row>

            {loadingMore && renderSkeletons(5)}

            {page < totalPages && !loadingMore && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  size="ms"
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
});

export default AllProducts;
