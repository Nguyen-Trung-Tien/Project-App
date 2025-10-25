import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
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
  const limit = 8;

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
        // Nếu có từ khóa tìm kiếm, gọi search API
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
    // Khi searchQuery thay đổi, reset trang về 1
    fetchProducts(1, false);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (page >= totalPages) return;
    fetchProducts(page + 1, true);
  };

  return (
    <section className="all-products-section py-5">
      <Container>
        <h2 className="section-title text-center mb-4 fw-bold">
          {searchQuery
            ? `Kết quả tìm kiếm: "${searchQuery}"`
            : "Tất cả sản phẩm"}
        </h2>

        {loading && !products.length ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted">Không tìm thấy sản phẩm nào.</p>
        ) : (
          <>
            <Row className="g-4 justify-content-center">
              {products.map((product) => (
                <Col key={product.id} md={3} sm={6} xs={12}>
                  <ProductCard product={product} userId={userId} />
                </Col>
              ))}
            </Row>

            {page < totalPages && (
              <div className="text-center mt-4">
                <Button
                  variant="primary"
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
        )}
      </Container>
    </section>
  );
};

export default AllProducts;
