import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./HomePage.scss";
import HeroSection from "../../components/HomePageComponent/HeroSection";
import CategorySection from "../../components/HomePageComponent/CategorySection";
import ProductSection from "../../components/HomePageComponent/ProductSection";
import AllProducts from "../../components/AllProducts/AllProduct";
import { getAllCategoryApi } from "../../api/categoryApi";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        if (res.errCode === 0) setCategories(res.data);
      } catch (err) {
        console.error("Fetch categories error:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container fluid className="homepage px-0">
      <HeroSection />

      <div className="my-5">
        <CategorySection categories={categories} loading={loadingCategories} />
      </div>

      <div className="my-5">
        <ProductSection
          categories={categories}
          loadingCategories={loadingCategories}
        />
      </div>

      <div className="my-5">
        <AllProducts
          categories={categories}
          loadingCategories={loadingCategories}
        />
      </div>
    </Container>
  );
};

export default HomePage;
