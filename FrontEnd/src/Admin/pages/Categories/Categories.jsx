import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Image,
  Spinner,
} from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getAllCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../../api/categoryApi";
import "./Categories.scss";

const Categories = () => {
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);

  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .trim();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.warning("Tên danh mục không được để trống");
      return false;
    }
    if (editingCategory) {
      const exists = categories.some(
        (c) => c.name === formData.name && c.id !== editingCategory.id
      );
      if (exists) {
        toast.warning("Tên danh mục đã tồn tại");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setFetching(true);
      const res = await getAllCategoryApi();
      if (res.errCode === 0) {
        setCategories(res.data || []);
      } else {
        toast.error(res.errMessage || "Lỗi tải danh mục");
      }
    } catch (err) {
      toast.error("Không thể kết nối server");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
      });
      setPreview(
        category.image ? `data:image/jpeg;base64,${category.image}` : null
      );
    } else {
      setFormData({ name: "", description: "", image: "" });
      setPreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "" });
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Ảnh không được quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setFormData({ ...formData, image: base64 });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const slug = generateSlug(formData.name);
    if (!slug) {
      toast.warning("Tên danh mục không hợp lệ để tạo slug");
      return;
    }

    const payload = { ...formData, slug };

    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await createCategoryApi(payload);
        toast.success("Thêm thành công");
      }
      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      const msg = err.response?.data?.errMessage || "Lỗi khi lưu";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này? Dữ liệu sẽ mất vĩnh viễn.")) return;
    try {
      setFetching(true);
      await deleteCategoryApi(id);
      toast.success("Xóa thành công");
      await fetchCategories();
    } catch (err) {
      console.log(err);
      toast.error("Không thể xóa (có thể đang có sản phẩm)");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="categories-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">📂 Quản lý danh mục</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FiPlus className="me-1" /> Thêm danh mục
        </Button>
      </div>
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Slug</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>
                      {cat.image ? (
                        <Image
                          src={`data:image/jpeg;base64,${cat.image}`}
                          alt={cat.name}
                          rounded
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        <span className="text-muted fst-italic">
                          Không có ảnh
                        </span>
                      )}
                    </td>
                    <td className="fw-semibold text-primary">{cat.name}</td>
                    <td>{cat.slug || "—"}</td>
                    <td>{cat.description || "—"}</td>
                    <td>
                      {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(cat)}
                        title="Chỉnh sửa"
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                        title="Xóa"
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Chưa có danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Tên danh mục *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên..."
                />
                <Form.Text className="text-muted d-block mt-1">
                  Slug: <strong>{generateSlug(formData.name) || "—"}</strong>
                </Form.Text>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn gọn..."
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>
                  <FiImage className="me-2" /> Ảnh danh mục
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <div className="mt-3 text-center">
                    <Image
                      src={preview}
                      alt="Preview"
                      rounded
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
