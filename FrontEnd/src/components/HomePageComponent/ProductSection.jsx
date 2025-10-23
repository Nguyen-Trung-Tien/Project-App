import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "../../styles/ProductSection.scss";
import { getAllProductApi } from "../../api/productApi";
import { toast } from "react-toastify";
import imgPro from "../../assets/Product.jpg";
import { addCart, createCart, getAllCarts } from "../../api/cartApi";
import { useSelector } from "react-redux";

const ProductSection = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null); // state để disable nút khi thêm

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProductApi();
        if (res?.errCode === 0) {
          const featured = res.products?.filter((p) => p.isActive)?.slice(0, 4);
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

  // Hàm xử lý hình ảnh
  const getImage = (img) => {
    if (!img) return imgPro;
    if (typeof img === "string") return img;
    if (img.data) {
      try {
        const base64String = btoa(
          new Uint8Array(img.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return `data:image/jpeg;base64,${base64String}`;
      } catch {
        return imgPro;
      }
    }
    return imgPro;
  };

  // Thêm sản phẩm vào giỏ
  const handleAddToCart = async (product, quantity = 1) => {
    if (!userId) {
      toast.warn("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    setAddingId(product.id);

    try {
      // Lấy giỏ hàng hiện tại của user
      const cartsRes = await getAllCarts();
      let cart = cartsRes.data.find((c) => c.userId === userId);

      // Nếu chưa có giỏ → tạo mới
      if (!cart) {
        const newCartRes = await createCart(userId);
        cart = newCartRes.data;
      }

      // Thêm sản phẩm vào giỏ
      const res = await addCart({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });

      if (res.errCode === 0) {
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <section className="products py-5">
      <Container>
        <h2 className="section-title text-center mb-4">
          ✨ Sản phẩm nổi bật ✨
        </h2>
        <Row className="g-4 justify-content-center">
          {products.map((item) => (
            <Col lg={3} md={4} sm={6} xs={12} key={item.id}>
              <Card className="product-card shadow-sm">
                <div
                  className="image-wrapper"
                  style={{ padding: "10px", background: "#fff" }}
                >
                  <Card.Img
                    variant="top"
                    src={getImage(item.image)}
                    alt={item.name}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "200px",
                    }}
                  />
                </div>
                <Card.Body>
                  <h5 className="mb-2">{item.name}</h5>
                  <p className="price">
                    {Number(item.price).toLocaleString("vi-VN")}₫
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill w-100"
                    disabled={
                      addingId === item.id || !item.isActive || item.stock < 1
                    }
                    onClick={() => handleAddToCart(item, 1)}
                  >
                    {addingId === item.id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <i className="bi bi-cart-plus me-2"></i>
                    )}
                    Thêm vào giỏ
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;
