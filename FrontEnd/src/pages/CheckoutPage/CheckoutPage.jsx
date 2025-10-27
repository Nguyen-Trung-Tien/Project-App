import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { createOrder } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi";
import { removeCartItem } from "../../redux/cartSlice";

import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user.user);

  const {
    selectedIds,
    product: singleProduct,
    quantity: singleQuantity,
  } = location.state || {};

  const isSingleProduct = !!singleProduct;
  const selectedItems = isSingleProduct
    ? [
        {
          id: singleProduct.id,
          product: singleProduct,
          quantity: singleQuantity,
        },
      ]
    : cartItems.filter((item) => selectedIds?.includes(item.id));

  const total = selectedItems.reduce((acc, item) => {
    const price = item.product?.discount
      ? (item.product.price * (100 - item.product.discount)) / 100
      : item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  const handleOrderComplete = async (orderData, paypalDetails = null) => {
    try {
      const orderRes = await createOrder(orderData);
      if (orderRes.errCode !== 0)
        return toast.error(orderRes.errMessage || "Lỗi khi tạo đơn hàng!");

      const orderId = orderRes.data.id;

      const paymentRes = await createPayment({
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
      });

      if (paymentRes.errCode && paymentRes.errCode !== 0)
        return toast.error(paymentRes.errMessage || "Thanh toán thất bại!");

      if (!isSingleProduct)
        selectedItems.forEach((item) => dispatch(removeCartItem(item.id)));

      toast.success("Đặt hàng thành công!");
      navigate(`/checkout-success/${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  if (!selectedItems.length) {
    return (
      <div className="text-center mt-5">
        <h5>Không có sản phẩm nào để thanh toán!</h5>
        <Link
          to={isSingleProduct ? "/" : "/cart"}
          className="btn btn-primary mt-3"
        >
          <ArrowLeftCircle size={20} className="me-1" /> Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page py-5">
      <Container>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Trang chủ</Link>
            </li>
            {!isSingleProduct && (
              <li className="breadcrumb-item">
                <Link to="/cart">Giỏ hàng</Link>
              </li>
            )}
            <li className="breadcrumb-item active">Thanh toán</li>
          </ol>
        </nav>

        <h2 className="text-center mb-4 fw-bold text-primary">
          💳 Chi tiết thanh toán
        </h2>

        <Row>
          <Col lg={8}>
            <CheckoutForm
              user={user}
              total={total}
              selectedItems={selectedItems}
              onOrderComplete={handleOrderComplete}
              isSingleProduct={isSingleProduct}
            />
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
