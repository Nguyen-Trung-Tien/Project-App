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
  Tag,
  PlusCircle,
  PencilSquare,
  Trash3,
  Search,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";
import "./BrandManage.scss";

import { toast } from "react-toastify";
import {
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  getAllBrandApi,
} from "../../../api/brandApi";
import { useSelector } from "react-redux";
import { getImage } from "../../../utils/decodeImage";

const BrandManage = () => {
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;

  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const tableTopRef = useRef(null);

  // Fetch all brands
  const fetchBrands = async (currentPage = 1, search = "") => {
    setLoadingTable(true);
    try {
      const res = await getAllBrandApi(currentPage, limit, search);
      if (res.errCode === 0) {
        setBrands(res.brands || []);
        setTotalPages(res.totalPages || 1);
        setPage(currentPage);
      } else {
        setBrands([]);
        setTotalPages(1);
        setPage(1);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi tải dữ liệu thương hiệu!");
    } finally {
      setLoadingTable(false);
      tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchBrands(1);
  }, []);

  // Modal
  const handleShowModal = (brand = null) => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        slug: brand.slug || "",
        description: brand.description || "",
        image: null,
      });
      setImagePreview(brand.image || null);
      setEditBrand(brand);
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
      setEditBrand(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditBrand(null);
    setImagePreview(null);
  };

  // Upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warn("Ảnh không được vượt quá 2MB");
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save brand
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Tên và slug không được để trống!");
      return;
    }

    setLoadingModal(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);

      let res;
      if (editBrand) {
        res = await updateBrandApi(editBrand.id, data, token);
      } else {
        res = await createBrandApi(data, token);
      }

      if (res.errCode === 0) {
        toast.success(
          editBrand
            ? "Cập nhật thương hiệu thành công!"
            : "Tạo thương hiệu mới thành công!"
        );
        fetchBrands(page);
        handleCloseModal();
      } else {
        toast.error(res.errMessage || "Thao tác thất bại!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoadingModal(false);
    }
  };

  // Delete brand
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

  const handleDeleteClick = (id) => {
    setConfirmModal({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteBrandApi(confirmModal.id, token);
      if (res.errCode === 0) {
        toast.success("Đã xóa thương hiệu!");
        const newPage = brands.length === 1 && page > 1 ? page - 1 : page;
        fetchBrands(newPage);
      } else {
        toast.error(res.errMessage || "Không thể xóa");
      }
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi xóa thương hiệu!");
    } finally {
      setConfirmModal({ show: false, id: null });
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
        <Pagination.First key="first" onClick={() => fetchBrands(1)}>
          <ChevronDoubleLeft />
        </Pagination.First>
      );
    }
    if (page > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => fetchBrands(page - 1)}>
          <ChevronLeft />
        </Pagination.Prev>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => fetchBrands(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (page < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => fetchBrands(page + 1)}>
          <ChevronRight />
        </Pagination.Next>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => fetchBrands(totalPages)}>
          <ChevronDoubleRight />
        </Pagination.Last>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">{items}</Pagination>
    );
  };

  return (
    <div className="brand-manage">
      <h3 className="mb-4">
        <Tag className="me-2" /> Quản lý thương hiệu
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
                  placeholder="Tìm kiếm thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchBrands(1, e.target.value);
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="success" onClick={() => handleShowModal()}>
                <PlusCircle className="me-1" /> Thêm thương hiệu
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
                  <th>Tên thương hiệu</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loadingTable ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : brands.length > 0 ? (
                  brands.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>
                        {b.image && (
                          <Image
                            src={getImage(b.image)}
                            rounded
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </td>

                      <td>{b.name}</td>
                      <td>{b.slug}</td>
                      <td className="text-start">{b.description || "—"}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-2"
                          onClick={() => handleShowModal(b)}
                        >
                          <PencilSquare />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteClick(b.id)}
                        >
                          <Trash3 />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-muted py-4">
                      Không có thương hiệu nào
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </Card.Body>
      </Card>

      {/* Modal Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editBrand ? (
              <>
                <PencilSquare className="me-2 text-warning" />
                Sửa thương hiệu
              </>
            ) : (
              <>
                <PlusCircle className="me-2 text-success" />
                Thêm thương hiệu
              </>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>
                <Tag className="me-1" /> Tên thương hiệu *
              </Form.Label>
              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Ví dụ: Apple"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                placeholder="apple"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <ImageIcon className="me-1" /> Ảnh thương hiệu (có thể bỏ trống)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="text-center mt-2">
                  <Image
                    src={
                      typeof imagePreview === "string"
                        ? imagePreview
                        : getImage(imagePreview)
                    }
                    rounded
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <small className="text-muted d-block">Preview</small>
                </div>
              )}
            </Form.Group>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={loadingModal}>
                {loadingModal ? (
                  <Spinner animation="border" size="sm" variant="primary" />
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, id: null })}
        centered
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa thương hiệu này?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmModal({ show: false, id: null })}
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

export default BrandManage;
