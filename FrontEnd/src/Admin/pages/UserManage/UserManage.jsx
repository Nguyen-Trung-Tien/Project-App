import React, { useState, useEffect, useRef } from "react";
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
import {
  PersonPlus,
  PencilSquare,
  Trash3,
  ArrowRepeat,
  Search,
  PersonCircle,
  CheckCircleFill,
  XCircleFill,
  ShieldLockFill,
  PersonFill,
} from "react-bootstrap-icons";
import "./UserManage.scss";
import { toast } from "react-toastify";
import {
  deleteUserApi,
  getAllUsersApi,
  registerUser,
  updateUserApi,
} from "../../../api/userApi";
import { useSelector } from "react-redux";
import AppPagination from "../../../components/Pagination/Pagination";

const UserManage = () => {
  const token = useSelector((state) => state.user.token);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    userId: null,
  });

  const searchTimeoutRef = useRef(null);

  const fetchUsers = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const res = await getAllUsersApi(token, page, limit, searchQuery.trim());
      if (res.errCode === 0) {
        setCurrentPage(res.pagination.currentPage);
        setTotalPages(res.pagination.totalPages || 1);

        const mappedUsers = (res.data || []).map((u) => ({
          id: u.id,
          name: u.username,
          email: u.email,
          phone: u.phone || "",
          address: u.address || "",
          role: u.role,
          status: u.isActive ? "active" : "blocked",
          avatar: u.avatar || null,
        }));
        setUsers(mappedUsers);
      } else {
        toast.error(res.errMessage || "Lỗi khi tải người dùng");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Lỗi khi kết nối API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers(1, search);
    }
  }, [token]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search);
    }, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  const handleShowModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCreateUser = async (formData) => {
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim();
    if (!username || !email)
      return toast.error("Tên và email không được để trống!");

    const data = {
      username,
      email,
      phone: formData.get("phone")?.trim() || "",
      address: formData.get("address")?.trim() || "",
      role: formData.get("role"),
      password: "123456",
    };

    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0)
      data.avatar = await fileToBase64(avatarFile);

    try {
      const res = await registerUser(data, token);
      if (res.errCode === 0) {
        toast.success("Thêm người dùng thành công!");
        fetchUsers(currentPage, search);
        handleCloseModal();
      } else toast.error(res.errMessage || "Có lỗi xảy ra");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm người dùng");
    }
  };

  const handleUpdateUser = async (formData, editUserId) => {
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim();
    if (!username || !email)
      return toast.error("Tên và email không được để trống!");

    const data = {
      id: editUserId,
      username,
      email,
      phone: formData.get("phone")?.trim() || "",
      address: formData.get("address")?.trim() || "",
      role: formData.get("role"),
    };

    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0)
      data.avatar = await fileToBase64(avatarFile);

    try {
      const res = await updateUserApi(data, token);
      if (res.errCode === 0) {
        toast.success("Cập nhật thành công!");
        fetchUsers(currentPage, search);
        handleCloseModal();
      } else toast.error(res.errMessage || "Lỗi khi cập nhật");
    } catch (err) {
      console.error("Update user error:", err);
      toast.error("Lỗi khi cập nhật người dùng");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (editUser) handleUpdateUser(formData, editUser.id);
    else handleCreateUser(formData);
  };

  const handleDeleteClick = (id) => setConfirmModal({ show: true, userId: id });

  const handleConfirmDelete = async () => {
    const id = confirmModal.userId;
    if (!id) return;

    try {
      const res = await deleteUserApi(id, token);
      if (res.errCode === 0) {
        toast.success("Xóa người dùng thành công!");
        fetchUsers(currentPage, search);
      } else toast.error(res.errMessage || "Lỗi khi xóa");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa người dùng");
    } finally {
      setConfirmModal({ show: false, userId: null });
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user || user.role === "admin")
      return toast.warn("Không thể thay đổi trạng thái Admin!");

    try {
      const isActive = user.status === "active";
      const formData = new FormData();
      formData.append("id", id);
      formData.append("isActive", !isActive);

      const res = await updateUserApi(formData, token);
      if (res.errCode === 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: !isActive ? "active" : "blocked" } : u
          )
        );
        toast.success("Cập nhật trạng thái thành công!");
      } else toast.error(res.errMessage || "Lỗi khi cập nhật trạng thái");
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <>
      <div className="user-manage">
        <h3 className="mb-4">
          <PersonFill className="me-2" /> Quản lý người dùng
        </h3>
        <Card className="shadow-sm">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="success" onClick={() => handleShowModal()}>
                  <PersonPlus className="me-1" /> Thêm người dùng
                </Button>
              </Col>
            </Row>

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
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      <PersonCircle
                        size={32}
                        className="mb-2 d-block mx-auto opacity-50"
                      />
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>#{u.id}</strong>
                      </td>
                      <td>
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            width="40"
                            height="40"
                            className="rounded-circle object-fit-cover border"
                            alt="Avatar"
                          />
                        ) : (
                          <PersonCircle size={40} className="text-muted" />
                        )}
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>{u.address || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin" ? "bg-danger" : "bg-primary"
                          } d-flex align-items-center justify-content-center`}
                          style={{ width: "80px" }}
                        >
                          {u.role === "admin" ? (
                            <>
                              <ShieldLockFill className="me-1" size={12} />{" "}
                              Admin
                            </>
                          ) : (
                            <>
                              <PersonFill className="me-1" size={12} /> User
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.status === "active"
                              ? "bg-success"
                              : "bg-secondary"
                          } d-flex align-items-center justify-content-center`}
                          style={{ width: "80px" }}
                        >
                          {u.status === "active" ? (
                            <>
                              <CheckCircleFill className="me-1" size={12} />{" "}
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <XCircleFill className="me-1" size={12} /> Đã khóa
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleShowModal(u)}
                          className="me-1"
                        >
                          <PencilSquare size={14} />
                        </Button>
                        {u.role !== "admin" && (
                          <>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(u.id)}
                              className="me-1"
                            >
                              <Trash3 size={14} />
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => toggleStatus(u.id)}
                            >
                              <ArrowRepeat size={14} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <AppPagination
              page={currentPage}
              totalPages={totalPages}
              loading={loading}
              onPageChange={(p) => fetchUsers(p, search)}
            />
          </Card.Body>
        </Card>

        {/* Modal thêm/sửa người dùng */}
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editUser ? (
                <>
                  <PencilSquare className="me-2 text-warning" /> Chỉnh sửa người
                  dùng
                </>
              ) : (
                <>
                  <PersonPlus className="me-2 text-success" /> Thêm người dùng
                  mới
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave} encType="multipart/form-data">
              <Form.Group className="mb-3">
                <Form.Label>Họ tên *</Form.Label>
                <Form.Control
                  name="username"
                  defaultValue={editUser?.name || ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  defaultValue={editUser?.email || ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  defaultValue={editUser?.phone || ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
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
              {editUser && (
                <Form.Group className="mb-3">
                  <Form.Label>Avatar (để trống nếu không thay đổi)</Form.Label>
                  <Form.Control type="file" name="avatar" accept="image/*" />
                  {editUser.avatar && (
                    <div className="mt-2">
                      <img
                        src={editUser.avatar}
                        alt="Current"
                        width="60"
                        className="rounded border"
                      />
                      <small className="d-block text-muted">Ảnh hiện tại</small>
                    </div>
                  )}
                </Form.Group>
              )}
              <div className="text-end mt-4">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="me-2"
                >
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editUser ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal confirm xóa */}
        <Modal
          show={confirmModal.show}
          onHide={() => setConfirmModal({ show: false, userId: null })}
          centered
        >
          <Modal.Header closeButton className="bg-warning text-dark">
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc muốn xóa người dùng này không?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setConfirmModal({ show: false, userId: null })}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default UserManage;
