import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Spinner,
  Form,
  Pagination,
  Modal,
  InputGroup,
  Card,
} from "react-bootstrap";
import {
  Trash3,
  StarFill,
  PersonFill,
  Calendar3,
  InfoCircle,
} from "react-bootstrap-icons";
import { deleteReviewApi, getAllReviewsApi } from "../../../api/reviewApi";
import {
  getRepliesByReviewApi,
  createReplyApi,
  deleteReplyApi,
} from "../../../api/reviewReplyApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReviewPage.scss";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replies, setReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const user = useSelector((state) => state.user.user);
  const token = user?.accessToken;

  const [filters, setFilters] = useState({ rating: "", status: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsApi(
        pagination.page,
        pagination.limit,
        filters.rating,
        filters.status,
        token
      );
      setReviews(res.data || []);
      setPagination(res.pagination || pagination);

      const newReplies = {};
      for (let r of res.data) {
        const replyRes = await getRepliesByReviewApi(r.id);
        if (replyRes.errCode === 0) newReplies[r.id] = replyRes.data;
      }
      setReplies(newReplies);
    } catch (e) {
      console.error(e);
      toast.error("Lấy dữ liệu thất bại");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteReview = async () => {
    try {
      await deleteReviewApi(selectedReview.id, token);
      setShowDeleteModal(false);
      fetchReviews();
      toast.success("Xóa bình luận thành công");
    } catch (e) {
      console.error(e);
      toast.error("Xóa bình luận thất bại");
    }
  };

  const handleCreateReply = async (reviewId) => {
    const content = replyInputs[reviewId]?.trim();
    if (!content) return;
    try {
      const res = await createReplyApi({ reviewId, comment: content }, token);
      if (res.errCode === 0) {
        setReplies((prev) => ({
          ...prev,
          [reviewId]: [...(prev[reviewId] || []), res.data],
        }));
        setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
        toast.success("Trả lời thành công");
      } else {
        toast.error("Trả lời thất bại");
      }
    } catch (e) {
      console.error(e);
      toast.error("Trả lời thất bại");
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    try {
      const res = await deleteReplyApi(replyId, token);
      if (res.errCode === 0) {
        setReplies((prev) => ({
          ...prev,
          [reviewId]: prev[reviewId].filter((r) => r.id !== replyId),
        }));
        toast.success("Xóa trả lời thành công");
      } else {
        toast.error("Xóa trả lời thất bại");
      }
    } catch (e) {
      console.error(e);
      toast.error("Xóa trả lời thất bại");
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === pagination.page}
          onClick={() => setPagination((p) => ({ ...p, page: i }))}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pages;
  };

  return (
    <div className="review-page container-fluid">
      <h3 className="mb-4">Quản lý bình luận</h3>

      {/* Filters */}
      <Card className="mb-4 p-3 filter-card shadow-sm">
        <div className="d-flex flex-wrap gap-3">
          <Form.Select
            className="filter-select"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">Lọc theo số sao</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} sao
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Trạng thái</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
          </Form.Select>

          <Button
            variant="secondary"
            onClick={() => setFilters({ rating: "", status: "" })}
          >
            Reset bộ lọc
          </Button>
        </div>
      </Card>

      {/* Reviews */}
      <div className="reviews-list">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <InfoCircle size={20} /> Không có bình luận nào
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="mb-3 shadow-sm review-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <PersonFill />{" "}
                    <strong>{review.user?.username || "Unknown"}</strong>
                    <span className="ms-2 text-muted">
                      - {review.product?.name}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarFill key={i} className="text-warning" />
                    ))}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash3 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="review-comment mb-2">{review.comment}</div>
                <div className="review-date text-muted mb-2">
                  <Calendar3 className="me-1" />
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </div>

                {/* Replies */}
                {(replies[review.id] || []).map((rep) => (
                  <Card key={rep.id} className="mb-2 reply-card p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <PersonFill />{" "}
                        <strong>{rep.user.username || "Unknown"}</strong>:{" "}
                        {rep.comment}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteReply(review.id, rep.id)}
                      >
                        <Trash3 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}

                {/* Add reply */}
                <InputGroup className="mt-2">
                  <Form.Control
                    placeholder="Trả lời bình luận..."
                    value={replyInputs[review.id] || ""}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({
                        ...prev,
                        [review.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleCreateReply(review.id)}
                  >
                    Trả lời
                  </Button>
                </InputGroup>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        {renderPagination()}
      </Pagination>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa bình luận này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteReview}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewPage;
