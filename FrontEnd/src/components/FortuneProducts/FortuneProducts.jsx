import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons";

import { fetchFortuneProducts } from "../../api/productApi";
import { getAllBrandApi } from "../../api/brandApi";
import { getAllCategoryApi } from "../../api/categoryApi";

import ProductCard from "../ProductCard/ProductCard";
import FengShuiChat from "../ChatBot/FengShui";
import AppPagination from "../Pagination/Pagination";

import "./FortuneProducts.scss";

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

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      const [brandRes, cateRes] = await Promise.all([
        getAllBrandApi(),
        getAllCategoryApi(),
      ]);

      if (brandRes?.errCode === 0) setBrands(brandRes.brands || []);
      if (cateRes?.errCode === 0) setCategories(cateRes.data || []);
    };

    loadData();
  }, []);

  /* ================= YEAR OPTIONS ================= */
  const yearOptions = Array.from({ length: 120 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  /* ================= FETCH PRODUCTS ================= */
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

      if (res?.errCode === 0) {
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
    } finally {
      setLoading(false);
    }
  }, [birthYear, brandId, categoryId, minPrice, maxPrice, sortBy, page, limit]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearch = () => setPage(1);

  /* ================= RENDER ================= */
  return (
    <Container className="fortune-page py-4">
      {/* ===== HEADER ===== */}
      <div className="fortune-header">
        <Link to="/" className="fortune-back">
          <ArrowLeftCircle size={18} />
          <span>Trang chủ</span>
        </Link>

        <h1>Gợi ý sản phẩm phong thủy</h1>
        <p>
          Chọn sản phẩm phù hợp với năm sinh & bản mệnh để thu hút may mắn và
          tài lộc
        </p>
      </div>

      {/* ===== AI CHAT ===== */}
      <Card className="fortune-card">
        <div className="card-title">🤖 Trợ lý phong thủy</div>
        <FengShuiChat setBirthYear={setBirthYear} />
      </Card>

      {/* ===== FILTER ===== */}
      <Card className="fortune-filter">
        <Form className="filter-grid">
          <Select
            options={yearOptions}
            value={birthYear ? { value: birthYear, label: birthYear } : null}
            onChange={(opt) => setBirthYear(opt.value)}
            placeholder="Năm sinh"
          />

          <Form.Select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
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
          />

          <Form.Control
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sắp xếp</option>
            <option value="sold">Bán chạy</option>
            <option value="priceAsc">Giá thấp → cao</option>
            <option value="priceDesc">Giá cao → thấp</option>
            <option value="newest">Mới nhất</option>
          </Form.Select>

          <Button className="search-btn" onClick={handleSearch}>
            Tìm sản phẩm
          </Button>
        </Form>
      </Card>

      {/* ===== LUCKY COLORS ===== */}
      {luckyColors.length > 0 && (
        <div className="fortune-colors">
          <span>Màu hợp mệnh:</span>
          {luckyColors.map((c, i) => (
            <div key={i} className="color-pill">
              {c}
            </div>
          ))}
        </div>
      )}

      {/* ===== CONTENT ===== */}
      {loading ? (
        <div className="fortune-loading">
          <Spinner animation="border" variant="primary" />
          <p>Đang phân tích phong thủy cho bạn...</p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">
          Không tìm thấy sản phẩm phù hợp.
        </p>
      ) : (
        <Row className="g-4">
          {products.map((p) => (
            <Col key={p.id} xs={6} md={4} lg={3} xl={2}>
              <ProductCard
                product={p}
                highlightColor={luckyColors.includes(p.color)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* ===== PAGINATION ===== */}
      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </Container>
  );
};

export default FortuneProducts;
