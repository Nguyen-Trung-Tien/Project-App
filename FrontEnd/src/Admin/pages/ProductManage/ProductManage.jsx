import { useState, useEffect, useRef } from "react";
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
import {
  BoxSeam,
  PlusCircle,
  PencilSquare,
  Trash3,
  Search,
  Image as ImageIcon,
  Tag,
  CurrencyDollar,
  Percent,
  Box,
  ToggleOn,
  ToggleOff,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import "./ProductManage.scss";
import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductApi,
  getAllProductApi,
  updateProductApi,
} from "../../../api/productApi";
import { getAllCategoryApi } from "../../../api/categoryApi";
import { getAllBrandApi } from "../../../api/brandApi";
import { getImage } from "../../../utils/decodeImage";
import { useSelector } from "react-redux";

const ProductManage = () => {
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;

  const [brands, setBrands] = useState([]);
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
    brandId: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    productId: null,
  });

  const searchTimeoutRef = useRef(null);
  const tableTopRef = useRef(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getAllCategoryApi();
      if (res.errCode === 0 && Array.isArray(res.data)) setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  // Fetch products
  const fetchProducts = async (currentPage = 1, search = "") => {
    setLoadingTable(true);
    try {
      const res = await getAllProductApi(currentPage, limit, search.trim());
      if (res.errCode === 0) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setPage(currentPage);
      } else {
        setProducts([]);
        setTotalPages(1);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải dữ liệu");
      setProducts([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoadingTable(false);
      tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await getAllBrandApi();
      if (res.errCode === 0 && Array.isArray(res.brands)) {
        setBrands(res.brands);
      }
    } catch (err) {
      console.error("Fetch brands error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts(1);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchProducts(1, searchTerm);
    }, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  // Modal show/hide
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
        brandId: product.brandId || "",
        image: null,
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
        brandId: "",
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
      if (file.size > 2 * 1024 * 1024) {
        toast.warn("Ảnh không được quá 2MB");
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save product
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Vui lòng điền đầy đủ tên, giá và danh mục!");
      return;
    }

    setLoadingModal(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discount", formData.discount || 0);
      data.append("stock", formData.stock);
      data.append("categoryId", formData.categoryId);
      data.append("isActive", formData.isActive ? 1 : 0);
      data.append("brandId", formData.brandId);
      if (formData.image) data.append("image", formData.image);

      let res;
      if (editProduct) {
        res = await updateProductApi(editProduct.id, data, token);
      } else {
        res = await createProductApi(data, token);
      }

      if (res.errCode === 0) {
        toast.success(
          editProduct ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!"
        );
        fetchProducts(page, searchTerm);
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Thao tác thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoadingModal(false);
    }
  };

  // Xóa sản phẩm với Modal confirm
  const handleDeleteClick = (id) => {
    setConfirmModal({ show: true, productId: id });
  };
  const handleConfirmDelete = async () => {
    const { productId } = confirmModal;
    if (!productId) return;
    try {
      const res = await deleteProductApi(productId, token);
      if (res.errCode === 0) {
        toast.success("Đã xóa sản phẩm!");
        const newPage = products.length === 1 && page > 1 ? page - 1 : page;
        fetchProducts(newPage, searchTerm);
      } else {
        toast.error(res.errMessage || "Không thể xóa");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi xóa sản phẩm");
    } finally {
      setConfirmModal({ show: false, productId: null });
    }
  };

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const pageNeighbours = 2;
    const startPage = Math.max(1, page - pageNeighbours);
    const endPage = Math.min(totalPages, page + pageNeighbours);

    if (startPage > 1) {
      items.push(
        <Pagination.First
          key="first"
          onClick={() => fetchProducts(1, searchTerm)}
        >
          <ChevronDoubleLeft />
        </Pagination.First>
      );
    }
    if (page > 1) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => fetchProducts(page - 1, searchTerm)}
        >
          <ChevronLeft />
        </Pagination.Prev>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => fetchProducts(i, searchTerm)}
        >
          {i}
        </Pagination.Item>
      );
    }
    if (page < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => fetchProducts(page + 1, searchTerm)}
        >
          <ChevronRight />
        </Pagination.Next>
      );
    }
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => fetchProducts(totalPages, searchTerm)}
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
    <div className="product-manage">
      <h3 className="mb-4">
        <BoxSeam className="me-2" /> Quản lý sản phẩm
      </h3>

      <Card className="shadow-sm">
        <Card.Body>
          {/* Search + Add */}
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="success" onClick={() => handleShowModal()}>
                <PlusCircle className="me-1" /> Thêm sản phẩm
              </Button>
            </Col>
          </Row>

          {/* Table */}
          <div ref={tableTopRef}>
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
                  <th>Thương hiệu</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Giảm</th>
                  <th>Tồn</th>
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
                ) : products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>#{p.id}</strong>
                      </td>
                      <td>
                        <Image
                          src={getImage(p.image)}
                          rounded
                          className="product-img"
                        />
                      </td>
                      <td className="text-start fw-medium">{p.name}</td>
                      <td>{p.sku || "—"}</td>
                      <td>{p.brand?.name || "—"}</td>
                      <td>{p.category?.name || "—"}</td>
                      <td>{Number(p.price).toLocaleString()}₫</td>
                      <td>{p.discount}%</td>
                      <td>{p.stock}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.isActive ? "bg-success" : "bg-secondary"
                          } d-flex align-items-center justify-content-center`}
                          style={{ width: 80 }}
                        >
                          {p.isActive ? (
                            <CheckCircleFill className="me-1" size={12} />
                          ) : (
                            <XCircleFill className="me-1" size={12} />
                          )}
                          {p.isActive ? "Hoạt động" : "Ẩn"}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleShowModal(p)}
                          className="me-1 m-1"
                          title="Sửa"
                        >
                          <PencilSquare size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-1 m-1"
                          onClick={() => handleDeleteClick(p.id)}
                          title="Xóa"
                        >
                          <Trash3 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">
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

      {/* Modal Thêm/Sửa */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? (
              <>
                <PencilSquare className="me-2 text-warning" /> Chỉnh sửa sản
                phẩm
              </>
            ) : (
              <>
                <PlusCircle className="me-2 text-success" /> Thêm sản phẩm mới
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form */}
          <Form onSubmit={handleSave}>
            <Row>
              {/* Left */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <Tag className="me-1" /> Tên sản phẩm *
                  </Form.Label>
                  <Form.Control
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <BoxSeam className="me-1" /> Mã SKU
                  </Form.Label>
                  <Form.Control
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="SKU-001"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <CurrencyDollar className="me-1" /> Giá (₫) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <Percent className="me-1" /> Giảm giá (%)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    min="0"
                    max="100"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <Tag className="me-1" /> Danh mục *
                  </Form.Label>
                  <Form.Select
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

                <Form.Group className="mb-3">
                  <Form.Label>
                    <Tag className="me-1" /> Thương hiệu *
                  </Form.Label>
                  <Form.Select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Right */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <Box className="me-1" /> Mô tả
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả chi tiết..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <BoxSeam className="me-1" /> Tồn kho *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <ImageIcon className="me-1" /> Ảnh sản phẩm{" "}
                    {editProduct && "(để trống nếu không đổi)"}
                  </Form.Label>
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
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                      <small className="text-muted d-block">Preview</small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label={
                      <>
                        {formData.isActive ? (
                          <ToggleOn className="me-1 text-success" />
                        ) : (
                          <ToggleOff className="me-1 text-secondary" />
                        )}
                        Hiển thị sản phẩm
                      </>
                    }
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-4">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={loadingModal}>
                {loadingModal ? (
                  <>
                    <Spinner animation="border" size="sm" /> Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, productId: null })}
        centered
      >
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa sản phẩm này không?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmModal({ show: false, productId: null })}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManage;
