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
import Loading from "../../components/Loading/Loading";
const ProductManage = () => {
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([
    {
      id: "SP001",
      name: "Giày thể thao Nike Air",
      price: 1500000,
      category: "Giày",
      stock: 20,
      status: "active",
    },
    {
      id: "SP002",
      name: "Áo thun Adidas Originals",
      price: 750000,
      category: "Áo",
      stock: 15,
      status: "hidden",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý mở modal
  const handleShowModal = (product = null) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  // Lưu hoặc cập nhật sản phẩm
  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const newProduct = {
      id: editProduct ? editProduct.id : `SP${Date.now()}`,
      name: form.name.value,
      price: parseInt(form.price.value),
      category: form.category.value,
      stock: parseInt(form.stock.value),
      status: "active",
    };

    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? newProduct : p))
      );
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }

    handleCloseModal();
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Chuyển trạng thái
  const toggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "hidden" : "active" }
          : p
      )
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <h3 className="mb-4">🛍️ Quản lý sản phẩm</h3>

        <Card className="shadow-sm">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="primary" onClick={() => handleShowModal()}>
                  ➕ Thêm sản phẩm
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
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá (₫)</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === "active" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {p.status === "active" ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleShowModal(p)}
                      >
                        ✏️
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️
                      </Button>{" "}
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => toggleStatus(p.id)}
                      >
                        👁️
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
              {editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                  name="name"
                  defaultValue={editProduct?.name || ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá (₫)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  defaultValue={editProduct?.price || ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Danh mục</Form.Label>
                <Form.Control
                  name="category"
                  defaultValue={editProduct?.category || ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tồn kho</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  defaultValue={editProduct?.stock || ""}
                  required
                />
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

export default ProductManage;
