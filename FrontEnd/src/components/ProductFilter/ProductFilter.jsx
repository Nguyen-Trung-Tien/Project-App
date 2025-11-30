import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getAllBrandApi } from "../../api/brandApi";
import { getAllCategoryApi } from "../../api/categoryApi";
import { getImage } from "../../utils/decodeImage";
import "./ProductFilter.scss";

function ProductFilter({ onFilterChange }) {
  const [show, setShow] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    brands: [],
    category: "",
    price: [0, 60000000],
    sort: "",
  });

  // Load brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrandApi();
        if (res.errCode === 0) setBrands(res.brands || []);
      } catch (err) {
        console.error("Lỗi load brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const toggleArray = (key, value) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((i) => i !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  const handlePriceChange = (e, index) => {
    const value = Number(e.target.value);
    setFilters((prev) => {
      const newPrice = [...prev.price];
      newPrice[index] = value;
      return { ...prev, price: newPrice };
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setShow(false);
  };

  const resetFilters = () => {
    setFilters({
      brands: [],
      category: "",
      price: [0, 60000000],
      sort: "",
    });
  };

  return (
    <>
      <Button variant="outline-primary" onClick={() => setShow(true)}>
        Bộ lọc
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bộ lọc sản phẩm</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* Brand Filter */}
          <div className="filter-section">
            <h6>Hãng</h6>
            <div className="grid brand-logos">
              {brands.map((b) => (
                <button
                  key={b.id}
                  className={
                    filters.brands.includes(b.id) ? "item active" : "item"
                  }
                  onClick={() => toggleArray("brands", b.id)}
                >
                  {b.image && (
                    <img
                      src={getImage(b.image)}
                      alt={b.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                        marginBottom: 4,
                      }}
                    />
                  )}
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section mt-3">
            <h6>Danh mục</h6>
            <Form.Select
              value={filters.category}
              onChange={handleCategoryChange}
            >
              <option value="">Tất cả</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Price Filter */}
          <div className="filter-section mt-3">
            <h6>Giá</h6>
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                type="number"
                value={filters.price[0]}
                onChange={(e) => handlePriceChange(e, 0)}
              />
              <span>-</span>
              <Form.Control
                type="number"
                value={filters.price[1]}
                onChange={(e) => handlePriceChange(e, 1)}
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-section mt-3">
            <h6>Sắp xếp</h6>
            <Form.Select value={filters.sort} onChange={handleSortChange}>
              <option value="">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </Form.Select>
          </div>
        </Offcanvas.Body>

        <div className="d-flex gap-2 p-3">
          <Button variant="secondary" onClick={resetFilters}>
            Xóa tất cả
          </Button>
          <Button variant="primary" onClick={applyFilters}>
            Áp dụng
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}

export default ProductFilter;
