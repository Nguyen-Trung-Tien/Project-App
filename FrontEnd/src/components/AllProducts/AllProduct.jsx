import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllProductApi } from "../../api/productApi";
import "./AllProducts.scss";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // loading page đầu
  const [loadingMore, setLoadingMore] = useState(false); // loading nút xem thêm
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const fetchProducts = async (currentPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await getAllProductApi(currentPage, limit);
      if (res && res.errCode === 0) {
        if (append) {
          setProducts((prev) => [...prev, ...(res.products || [])]);
        } else {
          setProducts(res.products || []);
        }
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
    fetchProducts(1, false); // load trang đầu
  }, []);

  const handleLoadMore = () => {
    if (page >= totalPages) return;
    fetchProducts(page + 1, true); // load trang tiếp theo, append
  };

  return (
    <section className="all-products-section py-5">
      <Container>
        <h2 className="section-title text-center mb-4 fw-bold">
          Tất cả sản phẩm
        </h2>

        {loading && !products.length ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted">
            Không có sản phẩm nào được tìm thấy.
          </p>
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
