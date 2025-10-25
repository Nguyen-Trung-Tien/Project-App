import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllCategoryApi } from "../../api/categoryApi";
import {
  getAllProductApi,
  getProductsByCategoryApi,
} from "../../api/productApi";
import Loading from "../../components/Loading/Loading";

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const limit = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi load danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async (page = 1, catId = "", append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      let res;
      if (!catId) {
        // Tất cả sản phẩm
        res = await getAllProductApi(page, limit);
      } else {
        // Sản phẩm theo category
        res = await getProductsByCategoryApi(catId, page, limit);
      }

      if (res?.errCode === 0) {
        const newProducts = res.products || [];
        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts
        );
        setCurrentPage(res.currentPage || page);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi load sản phẩm:", err);
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Init page
  useEffect(() => {
    const catIdFromQuery = searchParams.get("category") || "";
    setCategoryId(catIdFromQuery);
    fetchProducts(1, catIdFromQuery, false);
  }, [searchParams]);

  // Handle dropdown
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategoryId(selected);
    fetchProducts(1, selected, false);
  };

  // Handle "Xem thêm"
  const handleLoadMore = () => {
    if (currentPage >= totalPages) return;
    fetchProducts(currentPage + 1, categoryId, true);
  };

  if (loading && products.length === 0) return <Loading />;

  return (
    <Container className="py-4">
      <h3 className="mb-4">Danh sách sản phẩm</h3>

      {/* Dropdown filter */}
      <Form className="mb-4">
        <Form.Group controlId="categorySelect">
          <Form.Label>Lọc theo danh mục:</Form.Label>
          <Form.Select value={categoryId} onChange={handleCategoryChange}>
            <option value="">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>

      {/* Product list */}
      {products.length > 0 ? (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {currentPage < totalPages && (
            <div className="text-center mt-4">
              <Button onClick={handleLoadMore} disabled={loadingMore}>
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
