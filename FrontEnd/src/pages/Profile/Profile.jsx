import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "./Profile.scss";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Nguyễn Trung Tiến",
    email: "trungtien@example.com",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    avatar: "/images/avatar-default.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-page py-5">
      <Container>
        <h2 className="text-center text-primary mb-4">Hồ sơ cá nhân</h2>

        <Row className="justify-content-center">
          <Col md={4}>
            <Card className="profile-card shadow-sm text-center p-3">
              <div className="avatar-wrapper">
                <img src={user.avatar} alt="Avatar" className="avatar" />
              </div>
              <h4 className="mt-3">{user.name}</h4>
              <p className="text-muted">{user.email}</p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
              </Button>
            </Card>
          </Col>

          <Col md={7}>
            <Card className="shadow-sm p-4 profile-info">
              <h5 className="mb-3 text-secondary fw-bold">Thông tin cá nhân</h5>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {isEditing && (
                  <div className="text-end">
                    <Button variant="primary" onClick={handleSave}>
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
