import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import "../Layout.scss";
import { toast } from "react-toastify";
import {
  deleteUserApi,
  getAllUsersApi,
  registerUser,
  updateUserApi,
} from "../../api/userApi";
import Loading from "../../components/Loading/Loading";

const UserManage = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi(token);
      if (res.errCode === 0) {
        const mappedUsers = (res.data || []).map((u) => ({
          id: u.id,
          name: u.username,
          email: u.email,
          phone: u.phone || "",
          address: u.address || "",
          role: u.role,
          status: u.isActive ? "active" : "blocked",
          avatar: u.avatar ? u.avatar.toString("base64") : null,
        }));
        setUsers(mappedUsers);
      } else {
        toast.error(res.errMessage || "Lỗi khi tải người dùng");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Modal control
  const handleShowModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  // Create new user
  const handleCreateUser = async (form) => {
    const userData = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      role: form.role.value,
      password: "123456",
    };

    if (!userData.username || !userData.email) {
      return toast.error("Tên và email không được để trống!");
    }

    try {
      const res = await registerUser(userData);
      if (res.errCode === 0) {
        toast.success("Thêm người dùng thành công!");
        fetchUsers();
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gọi API");
    }
  };

  // Update existing user
  const handleUpdateUser = async (form, editUserId) => {
    const userData = {
      id: editUserId, // gắn ID vào payload
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      role: form.role.value,
      avatar: form.avatar?.value || null,
    };

    if (!userData.username || !userData.email) {
      return toast.error("Tên và email không được để trống!");
    }

    try {
      console.log("Updating user:", JSON.stringify(userData));

      const res = await updateUserApi(userData, token);

      if (res.errCode === 0) {
        toast.success("Cập nhật thành công!");
        fetchUsers();
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (err) {
      console.error("Update user error:", err.response?.data || err.message);
      toast.error("Lỗi khi gọi API cập nhật người dùng");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;

    if (editUser) {
      handleUpdateUser(form, editUser.id);
    } else {
      handleCreateUser(form);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      const res = await deleteUserApi(id, token);
      if (res.errCode === 0) {
        toast.success("Xóa người dùng thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error(res.errMessage || "Lỗi khi xóa user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa user");
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    try {
      const isActive = user.status === "active";

      const updatedData = {
        id,
        isActive: !isActive,
      };

      const res = await updateUserApi(updatedData, token);

      if (res.errCode === 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: !isActive ? "active" : "blocked" } : u
          )
        );
        toast.success("Cập nhật trạng thái thành công!");
      } else {
        toast.error(res.errMessage || "Lỗi khi cập nhật trạng thái");
      }
    } catch (err) {
      console.error("Toggle status error:", err.response?.data || err.message);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <>
      {loading && <Loading />};
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
            :
            <Table
              bordered
              hover
              responsive
              className="text-center align-middle"
            >
              <thead className="table-light">
                <tr>
                  <th>Mã</th>
                  <th>Avatar</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      {u.avatar ? (
                        <img
                          src={`data:image/png;base64,${u.avatar}`}
                          width="40"
                          className="rounded-circle"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.address}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin" ? "bg-danger" : "bg-primary"
                        }`}
                      >
                        {u.role === "admin" ? "Admin" : "Customer"}
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
                      {u.role !== "admin" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(u.id)}
                        >
                          🗑️
                        </Button>
                      )}{" "}
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
                  name="username"
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
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  defaultValue={editUser?.phone || ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  defaultValue={editUser?.address || ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="role"
                  defaultValue={editUser?.role || "customer"}
                >
                  <option value="customer">Customer</option>
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
    </>
  );
};

export default UserManage;
