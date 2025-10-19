import React from "react";
import Header from "../HeaderComponent/Header";
import Footer from "../FooterComponent/Footer";
const LayoutComponent = ({ children, isShowHeader, isShowFooter }) => {
  return (
    <>
      {isShowHeader && <Header />}
      <main>{children}</main>
      {isShowFooter && <Footer />}
    </>
  );
};

export default LayoutComponent;
