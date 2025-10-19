import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import { FiSave, FiUpload } from "react-icons/fi";
import "../Layout.scss";
const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: "My Online Shop",
    email: "admin@shop.com",
    phone: "0123 456 789",
    shippingFee: 25000,
    themeColor: "#0d6efd",
    description: "Cửa hàng chuyên cung cấp sản phẩm công nghệ chất lượng.",
    logo: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSettings({ ...settings, logo: file });
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Cài đặt đã được lưu thành công! ✅");
    // TODO: Gửi dữ liệu lên API backend
    console.log("Saved Settings:", settings);
  };

  return (
    <div className="p-4 settings-page">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h4 className="fw-bold mb-4">⚙️ Cài đặt hệ thống</h4>
          <Form onSubmit={handleSave}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên cửa hàng</Form.Label>
                  <Form.Control
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email liên hệ</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phí vận chuyển mặc định</Form.Label>
                  <Form.Control
                    type="number"
                    name="shippingFee"
                    value={settings.shippingFee}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Màu chủ đạo (Theme Color)</Form.Label>
                  <Form.Control
                    type="color"
                    name="themeColor"
                    value={settings.themeColor}
                    onChange={handleChange}
                    style={{ height: "50px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mô tả ngắn</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={4}
                    value={settings.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Logo cửa hàng</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <Button
                      variant="outline-primary"
                      className="ms-2"
                      onClick={() =>
                        document.getElementById("logo-upload").click()
                      }
                    >
                      <FiUpload className="me-1" /> Upload
                    </Button>
                  </div>
                  {previewLogo && (
                    <div className="mt-3 text-center">
                      <Image
                        src={previewLogo}
                        alt="Logo preview"
                        width={120}
                        height={120}
                        roundedCircle
                        className="shadow-sm"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <Button type="submit" variant="primary" className="px-4">
                <FiSave className="me-2" />
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
