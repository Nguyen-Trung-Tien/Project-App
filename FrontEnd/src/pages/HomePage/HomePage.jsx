import React from "react";
import "./HomePage.scss";
import HeroSection from "../../components/HomePageComponent/HeroSection";
import CategorySection from "../../components/HomePageComponent/CategorySection";
import ProductSection from "../../components/HomePageComponent/ProductSection";
import AboutSection from "../../components/HomePageComponent/AboutSection";
import Newsletter from "../../components/HomePageComponent/Newsletter";
import AllProducts from "../../components/AllProducts/AllProduct";

const HomePage = () => {
  return (
    <div className="homepage">
      <div>
        <HeroSection />
      </div>
      <div>
        <ProductSection />
      </div>
      <div>
        <CategorySection />
      </div>
      <div>
        <AllProducts />
      </div>
      <div>
        <AboutSection />
      </div>
      <div>
        <Newsletter />
      </div>
    </div>
  );
};

export default HomePage;
