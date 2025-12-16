import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Badge,
  Form,
} from "react-bootstrap";
import Select from "react-select";
import { fetchFortuneProducts } from "../../api/productApi";
import { getAllBrandApi } from "../../api/brandApi";
import { getAllCategoryApi } from "../../api/categoryApi";
import ProductCard from "../ProductCard/ProductCard";
import FengShuiChat from "../ChatBot/FengShui";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { Link } from "react-router";
import AppPagination from "../Pagination/Pagination";

const FortuneProducts = () => {
  const [birthYear, setBirthYear] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [luckyColors, setLuckyColors] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch brands & categories
  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getAllBrandApi();
      if (res.errCode === 0) setBrands(res.brands || []);
    };
    const fetchCategories = async () => {
      const res = await getAllCategoryApi();
      if (res.errCode === 0) setCategories(res.data || []);
    };
    fetchBrands();
    fetchCategories();
  }, []);

  const yearOptions = Array.from({ length: 120 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });
  // Debounced fetch products
  const fetchProducts = useCallback(async () => {
    if (!birthYear) return;
    setLoading(true);
    try {
      const res = await fetchFortuneProducts({
        birthYear,
        brandId,
        categoryId,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        page,
        limit,
      });
      if (res.errCode === 0) {
        setProducts(res.data || []);
        setLuckyColors(res.luckyColors || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        setProducts([]);
        setLuckyColors([]);
      }
    } catch (err) {
      console.error(err);
      setProducts([]);
      setLuckyColors([]);
    }
    setLoading(false);
  }, [birthYear, brandId, categoryId, minPrice, maxPrice, sortBy, page, limit]);

  useEffect(() => {
    const handler = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(handler);
  }, [fetchProducts]);

  const handleSearch = () => setPage(1);

  return (
    <Container className="py-4">
      <div className="text-left">
        <Link
          to={"/"}
          className="btn btn-outline-primary rounded-pill px-2 py-1 fw-semibold"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeftCircle size={14} className="me-1" />
          Quay lại
        </Link>
      </div>
      <h2 className="mb-4 text-center">Gợi ý sản phẩm theo phong thủy</h2>

      {/* Chatbot */}
      <FengShuiChat setBirthYear={setBirthYear} />

      {/* Filter Form */}
      <Form className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        <Select
          options={yearOptions}
          value={birthYear ? { value: birthYear, label: birthYear } : null}
          onChange={(option) => setBirthYear(option.value)}
          placeholder="Năm sinh"
          styles={{
            control: (base) => ({
              ...base,
              minWidth: "140px",
              borderRadius: "6px",
              borderColor: "#ced4da",
              height: "38px",
            }),
          }}
        />

        <Form.Select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          style={{ maxWidth: "180px" }}
        >
          <option value="">Thương hiệu</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ maxWidth: "180px" }}
        >
          <option value="">Danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Form.Select>

        <Form.Control
          type="number"
          placeholder="Giá từ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ maxWidth: "100px" }}
        />

        <Form.Control
          type="number"
          placeholder="Đến"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ maxWidth: "100px" }}
        />

        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: "160px" }}
        >
          <option value="">Sắp xếp</option>
          <option value="sold">Bán chạy</option>
          <option value="priceAsc">Giá thấp → cao</option>
          <option value="priceDesc">Giá cao → thấp</option>
          <option value="newest">Sản phẩm mới</option>
        </Form.Select>

        <Button variant="primary" onClick={handleSearch}>
          Tìm
        </Button>
      </Form>

      {/* Lucky colors */}
      {luckyColors.length > 0 && (
        <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
          <span>Màu phong thủy của bạn:</span>
          {luckyColors.map((c, idx) => (
            <Badge key={idx} bg="success" className="text-uppercase px-3 py-2">
              {c}
            </Badge>
          ))}
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <Row className="g-1">
          {products.map((p) => (
            <Col key={p.id} xs={6} sm={4} md={2}>
              <ProductCard
                product={p}
                highlightColor={luckyColors.includes(p.color)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
      />
    </Container>
  );
};

export default FortuneProducts;
