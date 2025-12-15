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
    brand: "",
    category: "",
    price: [0, 60000000],
    sort: "",
  });

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

  const handleBrandClick = (id) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand === id ? "" : id,
    }));
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
    onFilterChange({
      ...filters,
      brandId: filters.brand,
    });
    setShow(false);
  };

  const resetFilters = () => {
    setFilters({
      brand: "",
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

            <div className="brand-logos">
              {brands.map((b) => (
                <button
                  key={b.id}
                  className={`item ${filters.brand === b.id ? "active" : ""}`}
                  onClick={() => handleBrandClick(b.id)}
                >
                  <img
                    src={getImage(b.image)}
                    alt={b.name}
                    style={{
                      width: 60,
                      height: 28,
                      objectFit: "contain",
                      marginBottom: 4,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section mt-3">
            <h6>Danh mục</h6>

            <div className="category-grid">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className={`category-item ${
                    filters.category === c.id ? "active" : ""
                  }`}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: c.id }))
                  }
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section mt-3">
            <h6>Giá</h6>
            <div className="d-flex gap-2 align-items-center price-input">
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

        <div className="d-flex gap-2 p-3 apply-buttons bg-white">
          <Button
            variant="secondary"
            className="flex-grow-1"
            onClick={resetFilters}
          >
            Xóa tất cả
          </Button>
          <Button
            variant="primary"
            className="flex-grow-1"
            onClick={applyFilters}
          >
            Áp dụng
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}

export default ProductFilter;
