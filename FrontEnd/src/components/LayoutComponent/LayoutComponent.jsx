import React from "react";
import Header from "../HeaderComponent/Header";
import Footer from "../FooterComponent/Footer";
import { useLocation } from "react-router-dom";

const LayoutComponent = ({
  children,
  isShowHeader = true,
  isShowFooter = true,
}) => {
  const location = useLocation();

  const hideFooterPaths = [
    "/cart",
    "/checkout",
    "/checkout-success",
    "/checkout-failed",
    "/order-history",
    "/orders",
    "/orders-detail",
    "/profile",
    "/product-detail",
    "/product-list",
    "/products",
    "/fortune-products",
  ];

  const shouldHideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {isShowHeader && <Header />}
      <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-light)" }}>
        {children}
      </main>
      {isShowFooter && !shouldHideFooter && <Footer />}
    </>
  );
};

export default LayoutComponent;
