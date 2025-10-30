import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Image,
  Modal,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/userSlice";
import {
  getUserApi,
  updateUserApi,
  updatePasswordApi,
} from "../../api/userApi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import "./Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
            avatar: data.avatar || null,
          });
        }
      } catch (err) {
        console.error(err);
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    if (!user?.id || !token) return;
    setLoading(true);

    try {
      const payload = {
        id: user.id,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar,
      };

      const res = await updateUserApi(payload, token);

      if (res.errCode === 0) {
        toast.success("Cập nhật thành công!");

        const userRes = await getUserApi(user.id, token);
        if (userRes.errCode === 0) {
          dispatch(updateUser(userRes.data));
          setFormData((prev) => ({ ...prev, ...userRes.data }));
        }

        setIsEditing(false);
      } else {
        toast.error(res.errMessage || "Lỗi server");
      }
    } catch (err) {
      console.error(err);
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
                <div className="avatar-container position-relative mb-3">
                  <Image
                    src={formData.avatar || "/images/avatar-default.png"}
                    roundedCircle
                    width={120}
                    height={120}
                    alt="Avatar"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAvatarModal(true)}
                  />
                  {isEditing && (
                    <div className="avatar-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                      <span className="text-white fw-bold position-absolute">
                        Thay đổi ảnh
                      </span>
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
                <Button
                  variant="outline-warning"
                  className="rounded-pill mt-3"
                  onClick={() => setShowPasswordModal(true)}
                >
                  🔒 Đổi mật khẩu
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

        <Modal
          show={showAvatarModal}
          onHide={() => setShowAvatarModal(false)}
          centered
        >
          <Modal.Body className="text-center">
            <Image
              src={formData.avatar || "/images/avatar-default.png"}
              rounded
              fluid
              alt="Avatar Preview"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAvatarModal(false)}
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>🔒 Đổi mật khẩu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu cũ</Form.Label>
                <Form.Control
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Nhập mật khẩu mới"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (!passwordData.oldPassword || !passwordData.newPassword) {
                  toast.warning("Vui lòng nhập đầy đủ thông tin");
                  return;
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  toast.error("Mật khẩu xác nhận không khớp!");
                  return;
                }

                try {
                  setLoading(true);
                  const res = await updatePasswordApi(
                    {
                      userId: user.id,
                      oldPassword: passwordData.oldPassword,
                      newPassword: passwordData.newPassword,
                    },
                    token
                  );
                  if (res.errCode === 0) {
                    toast.success("Đổi mật khẩu thành công!");
                    setShowPasswordModal(false);
                    setPasswordData({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  } else {
                    toast.error(res.errMessage || "Không thể đổi mật khẩu");
                  }
                } catch (err) {
                  console.log(err);
                  toast.error("Lỗi máy chủ khi đổi mật khẩu");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
