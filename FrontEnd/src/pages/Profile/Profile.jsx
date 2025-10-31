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
import Loading from "../../components/Loading/Loading";
import ChangePasswordModal from "./ChangePasswordModal";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import "./Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

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

  return (
    <>
      {loading && <Loading />}

      <div
        className="profile-page py-3"
        style={{
          background: "linear-gradient(120deg, #e0f7fa 0%, #f1f8ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Container>
          <div className="text-left">
            <Link
              to={"/"}
              className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
            >
              <ArrowLeftCircle size={16} className="me-1" />
              Quay lại trang chủ
            </Link>
          </div>
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill profile-title">
              <h3 className="fw-bold mb-0">Hồ sơ của bạn</h3>
            </div>
            <div className="title-underline mx-auto mt-2"></div>
          </div>

          <Row className="justify-content-center g-4">
            <Col md={4}>
              <Card className="shadow-lg border-0 rounded-4 text-center py-4 px-3">
                <div className="position-relative mb-3">
                  <Image
                    src={formData.avatar || "/images/avatar-default.png"}
                    roundedCircle
                    width={130}
                    height={130}
                    alt="Avatar"
                    onClick={() => setShowAvatarModal(true)}
                    style={{
                      cursor: "pointer",
                      border: "4px solid #4facfe",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>

                <h4 className="mt-2 mb-1 fw-bold text-dark">
                  {formData.username}
                </h4>
                <p className="text-muted small mb-4">{formData.email}</p>

                <div className="d-grid gap-2">
                  <Button
                    variant={isEditing ? "outline-danger" : "outline-primary"}
                    className="rounded-pill fw-semibold"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "❌ Hủy chỉnh sửa" : "✏️ Chỉnh sửa thông tin"}
                  </Button>
                  <Button
                    variant="outline-warning"
                    className="rounded-pill fw-semibold"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    🔒 Đổi mật khẩu
                  </Button>
                </div>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="shadow-lg border-0 rounded-4 p-4 bg-white">
                <h5 className="text-secondary fw-bold mb-3">
                  Thông tin cá nhân
                </h5>

                <Form>
                  <Row>
                    {["username", "email", "phone", "address"].map(
                      (field, i) => (
                        <Col md={i < 2 ? 6 : 12} key={field}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-muted">
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
                              className={`rounded-3 shadow-sm ${
                                isEditing
                                  ? "border-primary"
                                  : "border-light bg-light"
                              }`}
                            />
                          </Form.Group>
                        </Col>
                      )
                    )}
                  </Row>

                  {isEditing && (
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        className="rounded-pill px-4 fw-semibold text-white border-0"
                        style={{
                          background:
                            "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                        }}
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
            <Button
              variant="secondary"
              onClick={() => setShowAvatarModal(false)}
            >
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
    </>
  );
};

export default Profile;
