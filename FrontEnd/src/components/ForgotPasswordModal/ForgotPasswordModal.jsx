import React, { useState } from "react";
import { Modal, Button, Form, Spinner, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyResetTokenApi,
} from "../../api/userApi";

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
      } else {
        toast.error(res.errMessage);
      }
    } catch (err) {
      console.log(err);
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
      } else {
        toast.error(res.errMessage);
      }
    } catch (err) {
      console.log(err);
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
      } else {
        toast.error(res.errMessage || "Không thể đổi mật khẩu");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (step === 1) {
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
            {loading ? <Spinner animation="border" size="sm" /> : "Gửi mã"}
          </Button>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <Button variant="light" onClick={() => setStep(1)} disabled={loading}>
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleVerifyToken}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Xác thực mã"}
          </Button>
        </>
      );
    }
    // step 3
    return (
      <>
        <Button variant="light" onClick={() => setStep(2)} disabled={loading}>
          Quay lại
        </Button>
        <Button
          variant="success"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Đổi mật khẩu"}
        </Button>
      </>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 && "Khôi phục mật khẩu"}
          {step === 2 && "Nhập mã xác nhận"}
          {step === 3 && "Đặt mật khẩu mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      <Modal.Footer>{renderFooter()}</Modal.Footer>
    </Modal>
  );
};

/* Subcomponents for clarity */
const FormStepEmail = ({ email, setEmail }) => (
  <>
    <p>
      Vui lòng nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận đến email
      này.
    </p>
    <Form.Group>
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
      />
    </Form.Group>
  </>
);

const FormStepToken = ({ email, token, setToken, onResend }) => (
  <>
    <p>
      Đã gửi mã xác nhận tới: <strong>{email}</strong>
    </p>
    <Form.Group>
      <Form.Label>Mã xác nhận</Form.Label>
      <InputGroup>
        <Form.Control
          placeholder="dán mã xác nhận (UUID)"
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
        />
        <Button variant="outline-secondary" onClick={onResend}>
          Gửi lại
        </Button>
      </InputGroup>
      <Form.Text className="text-muted">
        Mã có hiệu lực trong thời gian ngắn (ví dụ 15 phút).
      </Form.Text>
    </Form.Group>
  </>
);

const FormStepNewPassword = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) => (
  <>
    <Form.Group>
      <Form.Label>Mật khẩu mới</Form.Label>
      <Form.Control
        type="password"
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="mt-3">
      <Form.Label>Xác nhận mật khẩu</Form.Label>
      <Form.Control
        type="password"
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </Form.Group>
  </>
);

export default ForgotPasswordModal;
