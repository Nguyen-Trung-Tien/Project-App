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
  Image,
  Spinner,
  Pagination,
} from "react-bootstrap";
import "../Layout.scss";
import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductApi,
  getAllProductApi,
  updateProductApi,
} from "../../api/productApi";
import { getAllCategoryApi } from "../../api/categoryApi";
import { getImage } from "../../utils/decodeImage";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    categoryId: "",
    isActive: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Loading table và modal riêng
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  // Fetch danh mục
  const fetchCategories = async () => {
    try {
      const res = await getAllCategoryApi();
      if (res.errCode === 0 && Array.isArray(res.data)) setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  // Fetch sản phẩm theo page
  const fetchProducts = async (currentPage = 1) => {
    setLoadingTable(true);
    try {
      const res = await getAllProductApi(currentPage, limit);
      if (res.errCode === 0 && Array.isArray(res.products)) {
        setProducts(res.products);
        setTotalPages(res.totalPages || 1);
        setPage(currentPage);

        // Scroll về đầu table
        const tableTop = document.getElementById("product-table-top");
        if (tableTop) tableTop.scrollIntoView({ behavior: "smooth" });
      } else setProducts([]);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(page);
  }, []);

  // Modal
  const handleShowModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        price: product.price || "",
        discount: product.discount || "",
        stock: product.stock || "",
        categoryId: product.categoryId || "",
        isActive: product.isActive ?? true,
        image: product.image || null,
      });
      setImagePreview(getImage(product.image));
      setEditProduct(product);
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        categoryId: "",
        isActive: true,
        image: null,
      });
      setImagePreview(null);
      setEditProduct(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoadingModal(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discount", formData.discount);
      data.append("stock", formData.stock);
      data.append("categoryId", formData.categoryId);
      data.append("isActive", formData.isActive);
      if (formData.image) data.append("image", formData.image);

      let res;
      if (editProduct) res = await updateProductApi(editProduct.id, data);
      else res = await createProductApi(data);

      if (res.errCode === 0) {
        toast.success(
          editProduct ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!"
        );
        fetchProducts(page);
        handleCloseModal();
      } else toast.error(res.data?.errMessage || "Thao tác thất bại!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await deleteProductApi(id);
      if (res.errCode === 0) {
        toast.success("Đã xóa sản phẩm!");
        fetchProducts(page);
      } else toast.error(res.errMessage);
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa sản phẩm!");
    }
  };

  // Filter client-side
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => fetchProducts(i)}
          className="custom-pagination-item"
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">{items}</Pagination>
    );
  };

  return (
    <div>
      <h3 className="mb-4">🛍️ Quản lý sản phẩm</h3>
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="🔍 Tìm kiếm sản phẩm..."
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

          <div id="product-table-top">
            <Table
              bordered
              hover
              responsive
              className="text-center align-middle"
            >
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>SKU</th>
                  <th>Danh mục</th>
                  <th>Giá (₫)</th>
                  <th>Giảm giá (%)</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingTable ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        <Image
                          src={getImage(p.image)}
                          alt={p.name}
                          rounded
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.sku || "—"}</td>
                      <td>{p.category?.name || "Không có"}</td>
                      <td>{Number(p.price).toLocaleString()}</td>
                      <td>{p.discount}%</td>
                      <td>{p.stock}</td>
                      <td>
                        {p.isActive ? (
                          <span className="badge bg-success">Hoạt động</span>
                        ) : (
                          <span className="badge bg-secondary">Ẩn</span>
                        )}
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
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-3">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </Card.Body>
      </Card>

      {/* Modal Thêm/Chỉnh sửa */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mã SKU</Form.Label>
                  <Form.Control
                    name="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả sản phẩm</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tồn kho</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 text-center">
                      <Image
                        src={imagePreview}
                        rounded
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Hoạt động"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>{" "}
              <Button variant="primary" type="submit" disabled={loadingModal}>
                {loadingModal ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManage;
