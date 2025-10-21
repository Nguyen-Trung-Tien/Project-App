import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.scss";
import { updateUser } from "../../redux/userSlice";
import { getUserApi } from "../../api/userApi";
import { toast } from "react-toastify";
import axiosClient from "../../utils/axiosClient";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "", // URL cho preview
  });
  const [isEditing, setIsEditing] = useState(false);

  // Convert ArrayBuffer từ backend BLOB sang Base64 để hiển thị
  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    const bytes = new Uint8Array(buffer.data || buffer); // nếu trả về {data: [...]}
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return;
      try {
        const res = await getUserApi(user.id, token);
        if (res && res.errCode === 0) {
          setFormData({
            ...res.data,
            avatar: bufferToBase64(res.data.avatar),
          });
        }
      } catch (err) {
        console.error("Get User API error:", err);
        toast.error("Không thể tải thông tin người dùng");
      }
    };
    fetchUser();
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id || !token) return;

    try {
      const fd = new FormData();
      fd.append("id", user.id);
      fd.append("username", formData.username);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("address", formData.address);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await axiosClient.put("/user/update-user", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.errCode === 0) {
        dispatch(updateUser(res.data.data));
        setIsEditing(false);
        setAvatarFile(null); // reset file sau khi lưu
        toast.success("Cập nhật thành công!");
      } else {
        toast.error(res.data.errMessage || "Lỗi server");
      }
    } catch (err) {
      console.error("Update User API error:", err);
      toast.error("Lỗi server, vui lòng thử lại!");
    }
  };

  return (
    <div className="profile-page py-2">
      <Container>
        <h2 className="text-center text-primary mb-4">Hồ sơ cá nhân</h2>

        <Row className="justify-content-center">
          <Col md={4}>
            <Card className="profile-card shadow-sm text-center p-3">
              <div className="avatar-wrapper">
                <img
                  src={formData.avatar || "/images/avatar-default.png"}
                  alt="Avatar"
                  className="avatar"
                />
                {isEditing && (
                  <Form.Group controlId="formAvatar" className="mt-3">
                    <Form.Label className="small text-muted">
                      Thay ảnh đại diện
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setAvatarFile(file);
                        setFormData((prev) => ({
                          ...prev,
                          avatar: URL.createObjectURL(file), // preview
                        }));
                      }}
                    />
                  </Form.Group>
                )}
              </div>

              <h4 className="mt-3">{formData.username || ""}</h4>
              <p className="text-muted">{formData.email || ""}</p>

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
                        name="username"
                        value={formData.username || ""}
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
                        value={formData.email || ""}
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
                        value={formData.phone || ""}
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
                        value={formData.address || ""}
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
