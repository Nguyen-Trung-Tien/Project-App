import React from "react";
import { Modal, Image, Button } from "react-bootstrap";

const AvatarModal = ({ show, onHide, avatar }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Body className="text-center">
      <Image
        src={avatar || "/images/avatar-default.png"}
        rounded
        fluid
        alt="Avatar Preview"
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Đóng
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AvatarModal;
