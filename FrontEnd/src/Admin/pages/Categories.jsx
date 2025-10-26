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
} from "../../api/categoryApi";
import "../Layout.scss";

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategoryApi();
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh mục");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
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
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setFormData({ ...formData, image: base64 });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.warning("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, formData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategoryApi(formData);
        toast.success("Thêm danh mục thành công");
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast.error("Lỗi khi lưu danh mục");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await deleteCategoryApi(id);
        toast.success("Xóa danh mục thành công");
        fetchCategories();
      } catch (err) {
        toast.error("Không thể xóa danh mục");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="p-4">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">📂 Quản lý danh mục</h4>
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FiPlus className="me-1" /> Thêm danh mục
              </Button>
            </div>

            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th style={{ width: "120px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
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
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span className="text-muted fst-italic">
                            Không có ảnh
                          </span>
                        )}
                      </td>
                      <td className="fw-semibold text-primary">{cat.name}</td>
                      <td>{cat.slug}</td>
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
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Không có danh mục nào
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
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
                  <Form.Label>Tên danh mục</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên danh mục"
                  />
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
                        alt="preview"
                        rounded
                        style={{
                          width: "100px",
                          height: "100px",
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
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Categories;
