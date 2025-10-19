import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "../Layout.scss";
const UserManage = () => {
  const [users, setUsers] = useState([
    {
      id: "U001",
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      role: "user",
      status: "active",
    },
    {
      id: "U002",
      name: "Trần Thị B",
      email: "tranb@example.com",
      role: "admin",
      status: "blocked",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Lọc danh sách
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Mở/đóng modal
  const handleShowModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  // Cập nhật thông tin user
  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedUser = {
      id: editUser ? editUser.id : `U${Date.now()}`,
      name: form.name.value,
      email: form.email.value,
      role: form.role.value,
      status: editUser?.status || "active",
    };

    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? updatedUser : u))
      );
    } else {
      setUsers((prev) => [...prev, updatedUser]);
    }
    handleCloseModal();
  };

  // Xóa user
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Khóa / mở khóa
  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return (
    <div className="user-manage">
      <h3 className="mb-4">👥 Quản lý người dùng</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm người dùng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="primary" onClick={() => handleShowModal()}>
                ➕ Thêm người dùng
              </Button>
            </Col>
          </Row>

          <Table bordered hover responsive className="text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {u.role === "admin" ? "Admin" : "Người dùng"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {u.status === "active" ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleShowModal(u)}
                    >
                      ✏️
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️
                    </Button>{" "}
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => toggleStatus(u.id)}
                    >
                      🔄
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                name="name"
                defaultValue={editUser?.name || ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={editUser?.email || ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select name="role" defaultValue={editUser?.role || "user"}>
                <option value="user">Người dùng</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>{" "}
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManage;
