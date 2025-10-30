import React, { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { updatePasswordApi } from "../../api/userApi";

const ChangePasswordModal = ({ show, onHide, userId, token }) => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (!oldPassword || !newPassword)
      return toast.warning("Vui lòng nhập đầy đủ thông tin");
    if (newPassword !== confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp!");

    try {
      setLoading(true);
      const res = await updatePasswordApi(
        { userId, oldPassword, newPassword },
        token
      );
      if (res.errCode === 0) {
        toast.success("Đổi mật khẩu thành công!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onHide();
      } else toast.error(res.errMessage || "Không thể đổi mật khẩu");
    } catch {
      toast.error("Lỗi máy chủ khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="md">
      <Modal.Header
        closeButton
        className="border-0"
        style={{
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
        }}
      >
        <Modal.Title className="fw-semibold d-flex align-items-center">
          <span role="img" aria-label="lock" className="me-2">
            🔒
          </span>
          Đổi mật khẩu
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <Form>
          {[
            { name: "oldPassword", label: "Mật khẩu cũ" },
            { name: "newPassword", label: "Mật khẩu mới" },
            { name: "confirmPassword", label: "Xác nhận mật khẩu mới" },
          ].map(({ name, label }) => (
            <Form.Group className="mb-3" key={name}>
              <Form.Label className="fw-medium text-secondary">
                {label}
              </Form.Label>
              <Form.Control
                type="password"
                name={name}
                value={passwordData[name]}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    [name]: e.target.value,
                  }))
                }
                placeholder={label}
                className="shadow-sm border-0 bg-light"
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4">
        <Button
          variant="outline-secondary"
          onClick={onHide}
          className="rounded-pill px-4"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="rounded-pill px-4 text-white border-0"
          style={{
            background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
