import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Image,
  Spinner,
  Badge,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import {
  Plus,
  Pencil,
  Trash3,
  Image as ImageIcon,
  Tag,
  Calendar3,
  ExclamationCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import {
  getAllCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../../api/categoryApi";
import "./Categories.scss";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const tableTopRef = useRef(null);

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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoryApi();
      if (res.errCode === 0) {
        const data = res.data || [];
        setCategories(data);
        const total = data.length;
        const calculatedTotalPages = Math.ceil(total / limit) || 1;
        setTotalPages(calculatedTotalPages);
        if (page > calculatedTotalPages && calculatedTotalPages > 0) {
          setPage(calculatedTotalPages);
        }
      } else {
        toast.error(res.errMessage || "Lỗi tải danh mục");
        setCategories([]);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error("Không thể kết nối server");
      console.error(err);
      setCategories([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategoryApi(payload);
        toast.success("Thêm danh mục thành công!");
      }
      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      const msg = err.response?.data?.errMessage || "Lỗi khi lưu danh mục";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này? Dữ liệu sẽ mất vĩnh viễn.")) return;

    try {
      setLoading(true);
      await deleteCategoryApi(id);
      toast.success("Xóa danh mục thành công!");
      await fetchCategories();
    } catch (err) {
      console.log(err);
      toast.error("Không thể xóa (có thể đang có sản phẩm liên kết)");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const paginatedCategories = categories.slice(
    (page - 1) * limit,
    page * limit
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const neighbours = 1;
    const start = Math.max(1, page - neighbours);
    const end = Math.min(totalPages, page + neighbours);

    if (start > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)}>
          <ChevronDoubleLeft />
        </Pagination.First>
      );
    }
    if (page > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(page - 1)}>
          <ChevronLeft />
        </Pagination.Prev>
      );
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (page < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(page + 1)}>
          <ChevronRight />
        </Pagination.Next>
      );
    }
    if (end < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        >
          <ChevronDoubleRight />
        </Pagination.Last>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">{items}</Pagination>
    );
  };

  return (
    <Container className="py-4 categories-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="m-0 d-flex align-items-center gap-2">
          <Tag className="text-primary" /> Quản lý danh mục
        </h3>
        <Button
          variant="success"
          onClick={() => handleShowModal()}
          className="d-flex align-items-center gap-1"
        >
          <Plus /> Thêm danh mục
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="mb-3">
            <Col className="text-end">
              <Badge bg="info" className="fs-6">
                {categories.length} danh mục
              </Badge>
            </Col>
          </Row>

          <div ref={tableTopRef}>
            <Table
              striped
              bordered
              hover
              responsive
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>
                    <ImageIcon className="me-1" /> Hình ảnh
                  </th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>
                    <Calendar3 className="me-1" /> Ngày tạo
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      <ExclamationCircle className="me-2" />
                      Chưa có danh mục nào
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <strong>#{cat.id}</strong>
                      </td>
                      <td>
                        {cat.image ? (
                          <Image
                            src={`data:image/jpeg;base64,${cat.image}`}
                            alt={cat.name}
                            rounded
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light border rounded d-flex align-items-center justify-content-center"
                            style={{ width: 50, height: 50 }}
                          >
                            <ImageIcon size={20} className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold text-primary">{cat.name}</td>
                      <td>
                        <code className="text-success small">
                          {cat.slug || "—"}
                        </code>
                      </td>
                      <td className="text-start">
                        {cat.description ? (
                          <span
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={cat.description}
                          >
                            {cat.description}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => handleShowModal(cat)}
                            title="Chỉnh sửa"
                            className="d-flex align-items-center"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(cat.id)}
                            title="Xóa"
                            className="d-flex align-items-center"
                          >
                            <Trash3 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Tag className="text-primary" />
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>
                  Tên danh mục <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Điện thoại, Laptop..."
                />
                <Form.Text className="text-muted">
                  Slug: <strong>{generateSlug(formData.name) || "—"}</strong>
                </Form.Text>
              </Col>

              <Col md={6}>
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn gọn về danh mục..."
                />
              </Col>

              <Col md={12}>
                <Form.Label>
                  <ImageIcon className="me-1" /> Ảnh danh mục
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
                        maxWidth: 120,
                        maxHeight: 120,
                        objectFit: "cover",
                        border: "2px solid #4361ee",
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
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="d-flex align-items-center gap-1"
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" /> Đang lưu...
              </>
            ) : (
              <>
                <Tag /> Lưu danh mục
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;
