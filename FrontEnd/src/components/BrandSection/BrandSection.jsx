import { useEffect, useState } from "react";
import { getAllBrandApi } from "../../api/brandApi";
import { Spinner } from "react-bootstrap";
import "./BrandSection.scss";
import { getImage } from "../../utils/decodeImage";
import { useNavigate } from "react-router-dom";

const BrandSection = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrandApi(1, 1000, "");

        if (res?.errCode === 0 && Array.isArray(res.brands)) {
          setBrands(res.brands);
        } else {
          setBrands([]);
        }
      } catch (err) {
        console.error("Fetch brands error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading)
    return (
      <div className="brand-section-loading text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="brand-section container my-4">
      <div className="brand-grid">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="brand-card-upgraded"
            onClick={() => navigate(`/product-list?brandId=${brand.id}`)}
          >
            <img
              src={getImage(brand.image)}
              alt={brand.name}
              className="brand-logo"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSection;
