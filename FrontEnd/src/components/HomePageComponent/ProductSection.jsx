import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getAllProductApi } from "../../api/productApi";
import { addCart, createCart, getAllCarts } from "../../api/cartApi";
import { addCartItem } from "../../redux/cartSlice";
import { getImage } from "../../utils/decodeImage";
import ProductCard from "../../components/ProductCard/ProductCard";

const SkeletonCard = () => (
  <div
    className="product-card shadow-sm border-0 rounded-3 overflow-hidden bg-white"
    style={{ maxWidth: "220px", height: "300px" }}
  >
    <div
      className="bg-secondary bg-opacity-10 rounded mb-3"
      style={{ width: "100%", height: "180px" }}
    />
    <div className="p-3">
      <div
        className="bg-secondary bg-opacity-10 rounded mb-2"
        style={{ height: "20px" }}
      />
      <div
        className="bg-secondary bg-opacity-10 rounded w-50"
        style={{ height: "20px" }}
      />
    </div>
  </div>
);

const ProductSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProductApi();
        if (res?.errCode === 0) {
          const featured = res.products
            ?.filter((p) => p.isActive)
            ?.slice(0, 6)
            ?.map((p) => ({
              ...p,
              image: getImage(p.image),
            }));
          setProducts(featured);
        } else {
          toast.error("Không thể tải sản phẩm!");
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        toast.error("Không thể tải sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product, quantity = 1) => {
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    setAddingId(product.id);

    try {
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);

      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }

      const res = await addCart({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });

      if (res.errCode === 0) {
        dispatch(addCartItem({ ...product, quantity }));
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      } else {
        toast.error(res.errMessage || "Thêm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      console.error("Error adding cart item:", err);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="products py-5 bg-light">
      <Container>
        <h2 className="section-title text-center mb-5 fw-bold fs-3">
          ✨ Sản phẩm nổi bật ✨
        </h2>

        {loading ? (
          <Row xs={1} sm={2} md={3} lg={5} className="g-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Col
                key={idx}
                lg={2}
                md={3}
                sm={6}
                xs={12}
                className="d-flex justify-content-center"
              >
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : products.length > 0 ? (
          <Row xs={1} sm={2} md={3} lg={5} className="g-3">
            {products.map((product) => (
              <Col
                key={product.id}
                className="d-flex justify-content-center"
                style={{ flex: "0 0 16.6667%" }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product, 1)}
                  adding={addingId === product.id}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="warning" className="text-center">
            Không có sản phẩm nổi bật nào!
          </Alert>
        )}
      </Container>
    </section>
  );
};

export default ProductSection;
