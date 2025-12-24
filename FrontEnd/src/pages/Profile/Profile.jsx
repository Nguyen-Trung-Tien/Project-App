import { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/userSlice";
import { getUserApi, updateUserApi } from "../../api/userApi";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";
import { ArrowLeftCircle } from "react-bootstrap-icons";
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

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return;
      setLoading(true);
      try {
        const res = await getUserApi(user.id, token);
        if (res?.errCode === 0) setFormData(res.data);
        else toast.error("Không thể tải thông tin người dùng");
      } catch {
        toast.error("Lỗi khi tải thông tin");
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
      const hasFile = formData.avatar instanceof File;
      let res;

      if (hasFile) {
        const data = new FormData();
        data.append("id", user.id);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("avatar", formData.avatar);
        res = await updateUserApi(data, token, true);
      } else {
        res = await updateUserApi({ id: user.id, ...formData }, token);
      }

      if (res.errCode === 0) {
        toast.success("Cập nhật thành công!");
        dispatch(updateUser(res.data));

        setIsEditing(false);
      } else {
        toast.error(res.errMessage || "Lỗi server");
      }
    } catch (error) {
      toast.error("Không thể cập nhật. Vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(formData.avatar);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return toast.error("Chưa chọn ảnh!");
    setAvatarLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const res = await updateUserApi({ id: user.id, avatar: base64 }, token);
        if (res.errCode === 0) {
          toast.success("Cập nhật avatar thành công!");
          setFormData((prev) => ({ ...prev, avatar: res.data.avatar }));
          dispatch(updateUser({ ...user, avatar: res.data.avatar }));
          setShowAvatarModal(false);
          window.location.reload();
        } else {
          toast.error(res.errMessage || "Lỗi cập nhật avatar");
        }
      } catch {
        toast.error("Không thể cập nhật avatar");
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };
  if (loading) {
    return (
      <div className="page-loading">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div
      className="profile-page py-3"
      style={{
        background: "#f9fafc",
        minHeight: "90vh",
      }}
    >
      <Container>
        {/* BACK */}
        <div className="mb-3">
          <Link to="/" className="back-btn">
            <ArrowLeftCircle size={16} /> Quay lại
          </Link>
        </div>
        <div className="profile-header mb-4">
          <h3 className="fw-bold text-primary mb-1">Thông tin cá nhân</h3>
          <p className="text-muted mb-0">
            Quản lý thông tin tài khoản và bảo mật của bạn
          </p>
        </div>
        <Row className="g-4">
          {/* LEFT – PROFILE CARD */}
          <Col lg={4}>
            <Card className="profile-card text-center">
              <div
                className="avatar-wrapper"
                onClick={() => setShowAvatarModal(true)}
              >
                <Image
                  src={formData.avatar || "/images/avatar-default.png"}
                  roundedCircle
                  className="avatar-img"
                />
                <span className="avatar-edit">Đổi ảnh</span>
              </div>

              <h4 className="username">{formData.username}</h4>
              <p className="email">{formData.email}</p>

              <div className="action-buttons">
                <Button
                  variant={isEditing ? "outline-danger" : "outline-primary"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                </Button>

                <Button
                  variant="outline-warning"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </Card>
          </Col>

          {/* RIGHT – FORM */}
          <Col lg={8}>
            <Card className="profile-form-card">
              <h5 className="form-title">Thông tin cá nhân</h5>

              <Form>
                <Row>
                  {["username", "email", "phone", "address"].map((field, i) => (
                    <Col md={i < 2 ? 6 : 12} key={field}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {
                            {
                              username: "Họ và tên",
                              email: "Email",
                              phone: "Số điện thoại",
                              address: "Địa chỉ",
                            }[field]
                          }
                        </Form.Label>

                        <Form.Control
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={isEditing ? "editable" : "readonly"}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                {isEditing && (
                  <div className="text-end mt-4">
                    <Button
                      className="save-btn"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : "Lưu thay đổi"}
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
            src={preview || "/images/avatar-default.png"}
            rounded
            fluid
            alt="Avatar Preview"
          />
          <Form.Group className="mt-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleAvatarUpload}
            disabled={avatarLoading}
          >
            {avatarLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        userId={user?.id}
        token={token}
      />
    </div>
  );
};

export default Profile;
