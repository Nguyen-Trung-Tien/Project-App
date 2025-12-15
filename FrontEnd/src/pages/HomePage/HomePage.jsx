import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./HomePage.scss";
import HeroSection from "../../components/HomePageComponent/HeroSection";
import CategorySection from "../../components/HomePageComponent/CategorySection";
import ProductSection from "../../components/HomePageComponent/ProductSection";
import AllProducts from "../../components/AllProducts/AllProduct";
import { getAllCategoryApi } from "../../api/categoryApi";
import ChatBot from "../../components/ChatBot/ChatBot";
import SmallBanner from "../../components/SmallBanner/SmallBanner";
import FlashSale from "../../components/FlashSale/FlashSale";
import Testimonials from "../../components/Testimonials/Testimonials";
import BlogSection from "../../components/BlogSection/BlogSection";
import Newsletter from "../../components/Newsletter/Newsletter";
import BrandSection from "../../components/BrandSection/BrandSection";

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
    <>
      <Container fluid className="homepage">
        <ChatBot />
        <HeroSection />
        <div className="my-3">
          <BrandSection />
        </div>
        <div className="my-3">
          <CategorySection
            categories={categories}
            loading={loadingCategories}
          />
        </div>
        <div className="my-1">
          <SmallBanner />
        </div>

        <div className="my-3">
          <FlashSale />
        </div>

        <div className="my-3">
          <ProductSection
            categories={categories}
            loadingCategories={loadingCategories}
          />
        </div>

        <div className="my-3">
          <AllProducts
            categories={categories}
            loadingCategories={loadingCategories}
          />
        </div>

        <div className="my-4">
          <Testimonials />
        </div>
        <div className="my-4">
          <BlogSection />
        </div>

        <div className="my-4">
          <Newsletter />
        </div>
      </Container>
    </>
  );
};

export default HomePage;
