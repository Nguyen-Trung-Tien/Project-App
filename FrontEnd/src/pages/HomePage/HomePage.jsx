import React from "react";
import { Container } from "react-bootstrap";
import "./HomePage.scss";
import HeroSection from "../../components/HomePageComponent/HeroSection";
import CategorySection from "../../components/HomePageComponent/CategorySection";
import ProductSection from "../../components/HomePageComponent/ProductSection";
import AllProducts from "../../components/AllProducts/AllProduct";

const HomePage = () => {
  return (
    <Container fluid className="homepage px-0">
      <HeroSection />
      <div className="my-5">
        <CategorySection />
      </div>
      <div className="my-5">
        <ProductSection />
      </div>
      <div className="my-5">
        <AllProducts />
      </div>
    </Container>
  );
};

export default HomePage;
