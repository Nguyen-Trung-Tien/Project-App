import { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { getAllBrandApi } from "../../api/brandApi";
import { getImage } from "../../utils/decodeImage"; // dùng hàm như trong BrandManage
import "./ProductFilter.scss";

function ProductFilter({ onFilterChange }) {
  const [show, setShow] = useState(false);
  const [brands, setBrands] = useState([]);

  const [filters, setFilters] = useState({
    brands: [],
    ram: [],
    rom: [],
    screen: [],
    battery: [],
    sort: null,
    price: [0, 60000000],
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrandApi();
        if (res.errCode === 0) {
          setBrands(res.brands || []);
        }
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      }
    };
    fetchBrands();
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

  const applyFilters = () => {
    onFilterChange(filters);
    setShow(false);
  };

  const resetFilters = () => {
    setFilters({
      brands: [],
      ram: [],
      rom: [],
      screen: [],
      battery: [],
      sort: null,
      price: [0, 60000000],
    });
  };

  return (
    <>
      <Button className="filter-main-btn" onClick={() => setShow(true)}>
        Bộ lọc
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bộ lọc nâng cao</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* BRAND */}
          <div className="filter-section">
            <h6>Hãng</h6>
            <div className="grid brand-logos">
              {brands.map((b) => (
                <button
                  key={b.id}
                  className={`item ${
                    filters.brands.includes(b.id) ? "active" : ""
                  }`}
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
                  <span style={{ fontSize: 12 }}>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Các filter khác giữ nguyên */}
          {/* RAM, ROM, Screen, Battery, Sort, Price */}
        </Offcanvas.Body>

        <div className="d-flex gap-2 p-3">
          <Button variant="secondary" className="w-50" onClick={resetFilters}>
            Xóa tất cả
          </Button>
          <Button className="w-50 apply" onClick={applyFilters}>
            Áp dụng
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}

export default ProductFilter;
