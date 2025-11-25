import "./SmallBanner.scss";
import { Container } from "react-bootstrap";
import { Truck, Tag, Headset } from "react-bootstrap-icons";

const SmallBanner = () => {
  const items = [
    { icon: <Truck />, title: "Miễn phí vận chuyển", desc: "Đơn từ 149K" },
    { icon: <Tag />, title: "Voucher khuyến mãi", desc: "Giảm đến 50%" },
    { icon: <Headset />, title: "Hỗ trợ 24/7", desc: "Tư vấn mọi lúc" },
  ];

  return (
    <Container className="small-banner">
      {items.map((item, idx) => (
        <div key={idx} className="banner-item d-flex align-items-center">
          <div className="icon-box">{item.icon}</div>
          <div className="ms-3">
            <h5>{item.title}</h5>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default SmallBanner;
