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
  Pagination,
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
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";
import "./UserManage.scss";
import { toast } from "react-toastify";
import {
  deleteUserApi,
  getAllUsersApi,
  registerUser,
  updateUserApi,
} from "../../../api/userApi";

const UserManage = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

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
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  const handleShowModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const handleCreateUser = async (formData) => {
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim();

    if (!username || !email) {
      return toast.error("Tên và email không được để trống!");
    }

    const data = {
      username,
      email,
      phone: formData.get("phone")?.trim() || "",
      address: formData.get("address")?.trim() || "",
      role: formData.get("role"),
      password: "123456",
    };

    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0) {
      try {
        data.avatar = await fileToBase64(avatarFile);
      } catch (err) {
        console.error("Convert avatar error:", err);
        return toast.error("Lỗi xử lý ảnh đại diện");
      }
    }

    try {
      const res = await registerUser(data, token);
      if (res.errCode === 0) {
        toast.success("Thêm người dùng thành công!");
        fetchUsers(currentPage, search);
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi thêm người dùng");
    }
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateUser = async (formData, editUserId) => {
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim();

    if (!username || !email) {
      return toast.error("Tên và email không được để trống!");
    }

    const data = {
      id: editUserId,
      username,
      email,
      phone: formData.get("phone")?.trim() || "",
      address: formData.get("address")?.trim() || "",
      role: formData.get("role"),
    };

    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0) {
      try {
        data.avatar = await fileToBase64(avatarFile);
      } catch (err) {
        console.error("Convert avatar error:", err);
        return toast.error("Lỗi xử lý ảnh đại diện");
      }
    }

    try {
      const res = await updateUserApi(data, token);
      if (res.errCode === 0) {
        toast.success("Cập nhật thành công!");
        fetchUsers(currentPage, search);
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Lỗi khi cập nhật");
      }
    } catch (err) {
      console.error("Update user error:", err);
      toast.error("Lỗi khi cập nhật người dùng");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (editUser) {
      formData.append("id", editUser.id);
      handleUpdateUser(formData, editUser.id);
    } else {
      formData.append("password", "123456");
      handleCreateUser(formData);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      const res = await deleteUserApi(id, token);
      if (res.errCode === 0) {
        toast.success("Xóa người dùng thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== id));
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
          fetchUsers(currentPage - 1, search);
        }
      } else {
        toast.error(res.errMessage || "Lỗi khi xóa");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa người dùng");
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user || user.role === "admin") {
      toast.warn("Không thể thay đổi trạng thái Admin!");
      return;
    }

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
      } else {
        toast.error(res.errMessage || "Lỗi khi cập nhật trạng thái");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const pageNeighbours = 2;
    const startPage = Math.max(1, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages, currentPage + pageNeighbours);

    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => fetchUsers(1, search)}>
          <ChevronDoubleLeft />
        </Pagination.First>
      );
    }
    if (currentPage > 1) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => fetchUsers(currentPage - 1, search)}
        >
          <ChevronLeft />
        </Pagination.Prev>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => fetchUsers(i, search)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => fetchUsers(currentPage + 1, search)}
        >
          <ChevronRight />
        </Pagination.Next>
      );
    }
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => fetchUsers(totalPages, search)}
        >
          <ChevronDoubleRight />
        </Pagination.Last>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">{items}</Pagination>
    );
  };

  return (
    <>
      <div className="user-manage">
        <h3 className="mb-4">
          <PersonFill className="me-2" />
          Quản lý người dùng
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
                          title="Chỉnh sửa"
                          className="me-1"
                        >
                          <PencilSquare size={14} />
                        </Button>{" "}
                        {u.role !== "admin" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(u.id)}
                            title="Xóa"
                            className="me-1"
                          >
                            <Trash3 size={14} />
                          </Button>
                        )}{" "}
                        {u.role !== "admin" && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => toggleStatus(u.id)}
                            title="Đổi trạng thái"
                          >
                            <ArrowRepeat size={14} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {renderPagination()}
          </Card.Body>
        </Card>

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
                  placeholder="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  defaultValue={editUser?.email || ""}
                  required
                  placeholder="email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  defaultValue={editUser?.phone || ""}
                  placeholder="phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  defaultValue={editUser?.address || ""}
                  placeholder="123 Đường ABC, Quận 1"
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
                      <small className="text-muted d-block">Ảnh hiện tại</small>
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
                </Button>{" "}
                <Button variant="primary" type="submit">
                  {editUser ? "Cập nhật" : "Thêm mới"}
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
