import React, { useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Card } from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import "../Layout.scss";
const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Điện thoại", description: "Sản phẩm di động" },
    { id: 2, name: "Laptop", description: "Máy tính xách tay" },
    { id: 3, name: "Phụ kiện", description: "Tai nghe, sạc, ốp lưng..." },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // 🟢 Mở form thêm/sửa
  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    setFormData(category || { name: "", description: "" });
    setShowModal(true);
  };

  // 🔴 Đóng form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  // ✏️ Lưu danh mục
  const handleSave = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    handleCloseModal();
  };

  // 🗑️ Xóa danh mục
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  return (
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
                <th>#</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th style={{ width: "120px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
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
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa */}
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
            <Row>
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
  );
};

export default Categories;
