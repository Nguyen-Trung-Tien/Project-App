import React, { useState } from "react";
import { Modal, Button, Form, Spinner, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyResetTokenApi,
} from "../../api/userApi";
import {
  EnvelopeAtFill,
  ShieldLockFill,
  KeyFill,
  ArrowLeft,
  ArrowClockwise,
  EyeFill,
  EyeSlashFill,
} from "react-bootstrap-icons";

const ForgotPasswordModal = ({ show, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setEmail("");
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.warning("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      if (res.errCode === 0) {
        toast.success(res.errMessage);
        setStep(2);
      } else toast.error(res.errMessage);
    } catch {
      toast.error("Lỗi khi gửi mã xác nhận");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token) {
      toast.warning("Vui lòng nhập mã xác nhận");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyResetTokenApi(email, token);
      if (res.errCode === 0) {
        toast.success(res.errMessage);
        setStep(3);
      } else toast.error(res.errMessage);
    } catch {
      toast.error("Lỗi khi xác thực mã");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi(email, token, newPassword);
      if (res.errCode === 0) {
        toast.success(res.errMessage || "Đổi mật khẩu thành công");
        handleClose();
      } else toast.error(res.errMessage || "Không thể đổi mật khẩu");
    } catch {
      toast.error("Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Gửi mã xác nhận"
              )}
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <ArrowLeft className="me-1" /> Quay lại
            </Button>
            <Button
              variant="primary"
              onClick={handleVerifyToken}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Xác thực mã"
              )}
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setStep(2)}
              disabled={loading}
            >
              <ArrowLeft className="me-1" /> Quay lại
            </Button>
            <Button
              variant="success"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary">
          {step === 1 && (
            <>
              <EnvelopeAtFill className="me-2" /> Khôi phục mật khẩu
            </>
          )}
          {step === 2 && (
            <>
              <ShieldLockFill className="me-2" /> Nhập mã xác nhận
            </>
          )}
          {step === 3 && (
            <>
              <KeyFill className="me-2" /> Đặt mật khẩu mới
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {step === 1 && <FormStepEmail email={email} setEmail={setEmail} />}
        {step === 2 && (
          <FormStepToken
            email={email}
            token={token}
            setToken={setToken}
            onResend={handleSendEmail}
          />
        )}
        {step === 3 && (
          <FormStepNewPassword
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        )}
      </Modal.Body>

      <Modal.Footer className="border-0">{renderFooter()}</Modal.Footer>
    </Modal>
  );
};

const FormStepEmail = ({ email, setEmail }) => (
  <>
    <p className="text-muted mb-3">
      Nhập email bạn đã đăng ký để nhận mã xác nhận khôi phục mật khẩu.
    </p>
    <Form.Group>
      <Form.Label className="fw-semibold">Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="nhập email của bạn..."
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
      />
    </Form.Group>
  </>
);

const FormStepToken = ({ email, token, setToken, onResend }) => (
  <>
    <p className="text-muted">
      Mã xác nhận đã được gửi tới: <strong>{email}</strong>
    </p>
    <Form.Group className="mb-2">
      <Form.Label className="fw-semibold">Mã xác nhận</Form.Label>
      <InputGroup>
        <Form.Control
          placeholder="Nhập mã khôi phục..."
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
        />
        <Button variant="outline-info" onClick={onResend}>
          <ArrowClockwise className="me-1" /> Gửi lại
        </Button>
      </InputGroup>
      <Form.Text className="text-muted">
        Mã có hiệu lực trong 15 phút. Kiểm tra hộp thư hoặc spam.
      </Form.Text>
    </Form.Group>
  </>
);

const FormStepNewPassword = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword.newPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            variant="light"
            className="border-0"
            onClick={() => toggleShowPassword("newPassword")}
          >
            {showPassword.newPassword ? (
              <EyeSlashFill className="text-secondary" />
            ) : (
              <EyeFill className="text-secondary" />
            )}
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <Form.Label className="fw-semibold">Xác nhận mật khẩu</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword.confirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="light"
            className="border-0"
            onClick={() => toggleShowPassword("confirmPassword")}
          >
            {showPassword.confirmPassword ? (
              <EyeSlashFill className="text-secondary" />
            ) : (
              <EyeFill className="text-secondary" />
            )}
          </Button>
        </InputGroup>
      </Form.Group>
    </>
  );
};

export default ForgotPasswordModal;
