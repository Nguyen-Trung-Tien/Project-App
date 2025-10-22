import React from "react";
import "./HomePage.scss";
import HeroSection from "../../components/HomePageComponent/HeroSection";
import CategorySection from "../../components/HomePageComponent/CategorySection";
import ProductSection from "../../components/HomePageComponent/ProductSection";
import AllProducts from "../../components/AllProducts/AllProduct";

const HomePage = () => {
  return (
    <div className="homepage">
      <div>
        <HeroSection />
      </div>

      <div>
        <CategorySection />
      </div>
      <div>
        <ProductSection />
      </div>
      <div>
        <AllProducts />
      </div>
    </div>
  );
};

export default HomePage;
