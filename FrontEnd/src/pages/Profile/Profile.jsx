import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.scss";
import { updateUser } from "../../redux/userSlice";
import { getUserApi } from "../../api/userApi";
import { toast } from "react-toastify";
import axiosClient from "../../utils/axiosClient";
import Loading from "../../components/Loading/Loading";

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
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    const bytes = new Uint8Array(buffer.data || buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return `data:image/png;base64,${window.btoa(binary)}`;
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return;
      setLoading(true);
      try {
        const res = await getUserApi(user.id, token);
        if (res && res.errCode === 0) {
          const data = res.data;
          setFormData({
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            avatar: data.avatarUrl
              ? data.avatarUrl
              : bufferToBase64(data.avatar),
          });
        }
      } catch (err) {
        console.log(err);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user?.id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id || !token) return;
    setLoading(true);

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
        const updated = res.data.data;
        const avatarSrc = updated.avatarUrl
          ? updated.avatarUrl
          : bufferToBase64(updated.avatar);

        dispatch(
          updateUser({
            id: updated.id,
            username: updated.username,
            email: updated.email,
            phone: updated.phone,
            address: updated.address,
            avatar: avatarSrc,
          })
        );

        setFormData((prev) => ({ ...prev, avatar: avatarSrc }));
        setIsEditing(false);
        setAvatarFile(null);
        toast.success("Cập nhật thành công!");
      } else {
        toast.error(res.data.errMessage || "Lỗi server");
      }
    } catch (err) {
      console.log(err);
      toast.error("Không thể cập nhật. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="profile-page py-4">
        <Container>
          <h2 className="text-center text-primary fw-bold mb-4">
            Hồ sơ cá nhân
          </h2>

          <Row className="justify-content-center g-4">
            <Col md={4}>
              <Card className="profile-card text-center shadow-sm p-4">
                <div className="avatar-container">
                  <img
                    src={formData.avatar || "/images/avatar-default.png"}
                    alt="Avatar"
                    className="avatar-preview"
                  />
                  {isEditing && (
                    <div className="avatar-overlay">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setAvatarFile(file);
                          setFormData((prev) => ({
                            ...prev,
                            avatar: URL.createObjectURL(file),
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>

                <h4 className="mt-3 mb-1 fw-bold">{formData.username}</h4>
                <p className="text-muted small">{formData.email}</p>

                <Button
                  variant={isEditing ? "outline-danger" : "outline-primary"}
                  className="rounded-pill mt-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                </Button>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="profile-info shadow-sm p-4">
                <h5 className="text-secondary fw-bold mb-3">
                  Thông tin cá nhân
                </h5>
                <Form>
                  <Row>
                    {["username", "email", "phone", "address"].map(
                      (field, i) => (
                        <Col md={i < 2 ? 6 : 12} key={field}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              {field === "username"
                                ? "Họ và tên"
                                : field === "email"
                                ? "Email"
                                : field === "phone"
                                ? "Số điện thoại"
                                : "Địa chỉ"}
                            </Form.Label>
                            <Form.Control
                              type={field === "email" ? "email" : "text"}
                              name={field}
                              value={formData[field] || ""}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                      )
                    )}
                  </Row>

                  {isEditing && (
                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="px-4 rounded-pill"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "💾 Lưu thay đổi"
                        )}
                      </Button>
                    </div>
                  )}
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Profile;
