import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/ProductSection.scss";
import { getAllProductApi } from "../../api/productApi";
import { toast } from "react-toastify";
import { addCart, createCart, getAllCarts } from "../../api/cartApi";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../Loading/Loading";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getImage } from "../../utils/decodeImage";
import { addCartItem } from "../../redux/cartSlice";

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
            ?.slice(0, 4)
            ?.map((p) => ({
              ...p,
              image: getImage(p.image),
            }));
          setProducts(featured);
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
    <>
      {loading && <Loading />}
      <section className="products py-5">
        <Container>
          <h2 className="section-title text-center mb-4">
            ✨ Sản phẩm nổi bật ✨
          </h2>

          <Row className="g-4 justify-content-center">
            {products.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product, 1)}
                  adding={addingId === product.id}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProductSection;
