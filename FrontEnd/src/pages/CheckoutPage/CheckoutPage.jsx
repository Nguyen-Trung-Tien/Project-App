import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftCircle, CreditCard } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi";
import { getAllCartItems } from "../../api/cartApi";
import { setCartItems, removeCartItem } from "../../redux/cartSlice";
import { resetCheckout } from "../../redux/checkoutSlice";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;

  const cartItems = useSelector((state) => state.cart.cartItems);
  const checkoutState = useSelector((state) => state.checkout);

  const { product: singleProduct, quantity: singleQuantity } =
    location.state || {};
  const isSingleProduct = !!singleProduct;

  const [loading, setLoading] = useState(
    !isSingleProduct && cartItems.length === 0
  );

  useEffect(() => {
    const fetchCart = async () => {
      if (!isSingleProduct && cartItems.length === 0) {
        setLoading(true);
        try {
          const res = await getAllCartItems(token);
          const items = res.data || [];
          dispatch(setCartItems(items));
        } catch (err) {
          console.error("Error fetching cart:", err);
          toast.error("Không thể tải giỏ hàng. Vui lòng thử lại!");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCart();
  }, [isSingleProduct, cartItems.length, dispatch, token]);

  const selectedItems = isSingleProduct
    ? [
        {
          id: singleProduct.id,
          product: singleProduct,
          quantity: singleQuantity,
        },
      ]
    : cartItems.filter((item) => checkoutState.selectedIds.includes(item.id));

  const total = selectedItems.reduce((acc, item) => {
    const price = item.product?.discount
      ? (item.product.price * (100 - item.product.discount)) / 100
      : item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  const handleOrderComplete = async (orderData, paypalDetails = null) => {
    try {
      const orderRes = await createOrder(orderData, token);
      if (orderRes.errCode !== 0)
        return toast.error(orderRes.errMessage || "Lỗi khi tạo đơn hàng!");
      const orderId = orderRes.data.id;

      const paymentRes = await createPayment(
        {
          orderId,
          userId: user.id,
          amount: total,
          method: orderData.paymentMethod,
          paymentStatus: paypalDetails
            ? "paid"
            : orderData.paymentMethod === "cod"
            ? "unpaid"
            : "paid",
          status: paypalDetails
            ? "completed"
            : orderData.paymentMethod === "cod"
            ? "pending"
            : "completed",
          paypalInfo: paypalDetails,
        },
        token
      );

      if (paymentRes.errCode && paymentRes.errCode !== 0)
        return toast.error(paymentRes.errMessage || "Thanh toán thất bại!");

      if (!isSingleProduct)
        selectedItems.forEach((item) => dispatch(removeCartItem(item.id)));

      dispatch(resetCheckout());
      toast.success("Đặt hàng thành công!");
      navigate(`/checkout-success/${orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Đang tải sản phẩm...</p>
      </div>
    );

  if (!selectedItems.length)
    return (
      <div className="text-center py-5">
        <h5 className="fw-semibold text-muted mb-3">
          Không có sản phẩm nào để thanh toán!
        </h5>
        <Link to={isSingleProduct ? "/" : "/cart"} className="btn btn-primary">
          <ArrowLeftCircle size={18} className="me-1" /> Quay lại
        </Link>
      </div>
    );

  return (
    <div className="checkout-page py-4 bg-light">
      <Container>
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="border-0 rounded-4 shadow-sm">
              <CheckoutForm
                user={user}
                total={total}
                selectedItems={selectedItems}
                onOrderComplete={handleOrderComplete}
                isSingleProduct={isSingleProduct}
              />
            </Card>
          </Col>
          <Col lg={4}>
            <OrderSummary selectedItems={selectedItems} total={total} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;
