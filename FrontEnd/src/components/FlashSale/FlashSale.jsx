import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountedProductsApi } from "../../api/productApi";
import { addCart, createCart, getAllCarts } from "../../api/cartApi";
import { addCartItem } from "../../redux/cartSlice";
import { getImage } from "../../utils/decodeImage";
import ProductCard from "../../components/ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";

const FlashSale = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const token = user?.accessToken;

  const [timeLeft, setTimeLeft] = useState(3600);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Countdown
  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t) =>
    `${String(Math.floor(t / 3600)).padStart(2, "0")}:${String(
      Math.floor((t % 3600) / 60)
    ).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  const fetchFlashSale = async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await getDiscountedProductsApi(page, 10);
      if (res?.errCode === 0) {
        const mapped = res.products.map((p) => ({
          ...p,
          image: getImage(p.image),
        }));
        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
      } else {
        if (!append) setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi tải Flash Sale:", error);
      toast.error("Không thể tải sản phẩm!");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFlashSale(1);
  }, []);

  const handleAddToCart = async (product, quantity = 1) => {
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    setAddingId(product.id);
    try {
      let cart = (await getAllCarts(token)).data.find(
        (c) => c.userId === userId
      );
      if (!cart) cart = (await createCart(token, userId)).data;

      const res = await addCart(
        { cartId: cart.id, productId: product.id, quantity },
        token
      );
      if (res.errCode === 0) {
        dispatch(addCartItem({ ...product, quantity }));
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      } else toast.error(res.errMessage || "Thêm vào giỏ hàng thất bại!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setAddingId(null);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchFlashSale(currentPage + 1, true);
    }
  };

  return (
    <section className="flash-sale-section py-3 bg-light">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fs-3 fw-bold">🔥 Flash Sale</h2>
          <span className="countdown fs-5">{formatTime(timeLeft)}</span>
        </div>

        {/* Product Grid */}
        {loading && !loadingMore ? (
          <Row className="g-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Col
                key={idx}
                xs={12}
                sm={6}
                md={4}
                lg={2}
                className="d-flex justify-content-center"
              >
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : products.length > 0 ? (
          <>
            <Row className="g-3">
              {products.map((product) => {
                const discountedPrice =
                  product.price * (1 - product.discount / 100);
                return (
                  <Col
                    key={product.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    className="d-flex justify-content-center"
                  >
                    <ProductCard
                      product={{
                        ...product,
                        discountedPrice,
                        badge:
                          product.discount > 0
                            ? `${product.discount}% OFF`
                            : null,
                      }}
                      onAddToCart={() => handleAddToCart(product, 1)}
                      adding={addingId === product.id}
                    />
                  </Col>
                );
              })}
            </Row>

            {/* Load More */}
            {currentPage < totalPages && (
              <LoadMoreButton
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loadingMore}
                onLoadMore={handleLoadMore}
              />
            )}
          </>
        ) : (
          <Alert variant="warning" className="text-center">
            Chưa có sản phẩm Flash Sale!
          </Alert>
        )}
      </Container>
    </section>
  );
};

export default FlashSale;
