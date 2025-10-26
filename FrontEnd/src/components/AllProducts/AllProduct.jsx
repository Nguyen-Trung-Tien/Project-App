import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllProductApi, searchProductsApi } from "../../api/productApi";
import "./AllProducts.scss";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Tăng limit để hiển thị nhiều sản phẩm hơn mỗi trang

  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const fetchProducts = async (currentPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      let res;
      if (searchQuery) {
        res = await searchProductsApi(searchQuery, currentPage, limit);
      } else {
        res = await getAllProductApi(currentPage, limit);
      }

      if (res && res.errCode === 0) {
        const newProducts = res.products || [];
        if (append) setProducts((prev) => [...prev, ...newProducts]);
        else setProducts(newProducts);

        setTotalPages(res.totalPages || 1);
        setPage(currentPage);
      } else {
        toast.error("Không thể tải danh sách sản phẩm!");
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (page >= totalPages) return;
    fetchProducts(page + 1, true);
  };

  return (
    <section className="all-products-section py-5 bg-light">
      <Container>
        <h2 className="section-title text-center mb-5 fw-bold fs-3">
          {searchQuery
            ? `Kết quả tìm kiếm: "${searchQuery}"`
            : "Tất cả sản phẩm"}
        </h2>

        {loading && !products.length ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <Alert variant="warning" className="text-center">
            Không tìm thấy sản phẩm nào phù hợp.
          </Alert>
        ) : (
          <>
            <Row className="g-3 justify-content-center">
              {products.map((product) => (
                <Col
                  key={`${product.id}-${Math.random()}`} // Lưu ý: Nên dùng unique key tốt hơn
                  lg={2} // 5 cột trên màn hình lớn
                  md={3} // 4 cột trên màn hình trung bình
                  sm={6} // 2 cột trên màn hình nhỏ
                  xs={12} // 1 cột trên màn hình rất nhỏ
                  className="d-flex justify-content-center"
                >
                  <ProductCard product={product} userId={userId} />
                </Col>
              ))}
            </Row>

            {page < totalPages && (
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
        )}
      </Container>
    </section>
  );
};

export default AllProducts;
