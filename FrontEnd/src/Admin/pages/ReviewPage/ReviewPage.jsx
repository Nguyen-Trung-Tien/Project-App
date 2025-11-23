import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Spinner,
  Form,
  Pagination,
  Modal,
  InputGroup,
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
import "./ReviewPage.scss";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState({}); // { reviewId: [reply1, reply2] }

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

      // Load replies cho các review
      const newReplies = {};
      for (let r of res.data) {
        const replyRes = await getRepliesByReviewApi(r.id);
        if (replyRes.errCode === 0) newReplies[r.id] = replyRes.data;
      }
      setReplies(newReplies);
    } catch (e) {
      console.error("Error fetching reviews:", e);
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
    } catch (e) {
      console.error("Error deleting review:", e);
    }
  };

  const handleCreateReply = async (reviewId) => {
    if (!replyContent.trim()) return;
    const res = await createReplyApi(
      { reviewId, comment: replyContent },
      token
    );
    if (res.errCode === 0) {
      setReplies((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), res.data],
      }));
      setReplyContent("");
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    const res = await deleteReplyApi(replyId, token);
    if (res.errCode === 0) {
      setReplies((prev) => ({
        ...prev,
        [reviewId]: prev[reviewId].filter((r) => r.id !== replyId),
      }));
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
    <div className="admin-reviews container-fluid">
      <div className="card p-3 shadow-sm rounded-3">
        <h4 className="mb-3">Quản lý bình luận</h4>

        {/* FILTERS */}
        <div className="review-filters mb-3 row g-3">
          <div className="col-md-3">
            <Form.Select
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
            >
              <option value="">Lọc theo số sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </Form.Select>
          </div>

          <div className="col-md-3">
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </Form.Select>
          </div>

          <div className="col-md-3">
            <Button
              variant="secondary"
              onClick={() => setFilters({ rating: "", status: "" })}
            >
              Reset bộ lọc
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <Table bordered hover className="review-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người dùng</th>
                <th>Sản phẩm</th>
                <th>Số sao</th>
                <th>Bình luận</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <InfoCircle size={18} /> Không có bình luận nào
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <React.Fragment key={review.id}>
                    <tr>
                      <td>{review.id}</td>
                      <td>
                        <PersonFill className="me-1" />
                        {review?.user?.username || "Unknown"}
                      </td>
                      <td>{review?.product?.name}</td>
                      <td>
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <StarFill key={i} className="text-warning me-1" />
                        ))}
                      </td>
                      <td>{review.comment}</td>
                      <td>
                        <Calendar3 className="me-1" />
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash3 />
                        </Button>
                      </td>
                    </tr>

                    {/* REPLIES */}
                    {(replies[review.id] || []).map((rep) => (
                      <tr key={rep.id} className="reply-row">
                        <td></td>
                        <td>
                          <PersonFill className="me-1" />
                          {rep.user.username || "Unknown"}
                        </td>
                        <td colSpan={4}>{rep.comment}</td>
                        <td className="text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteReply(review.id, rep.id)}
                          >
                            <Trash3 />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {/* ADD REPLY */}
                    <tr className="reply-add-row">
                      <td></td>
                      <td colSpan={6}>
                        <InputGroup>
                          <Form.Control
                            placeholder="Trả lời bình luận..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <Button
                            variant="primary"
                            onClick={() => handleCreateReply(review.id)}
                          >
                            Trả lời
                          </Button>
                        </InputGroup>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* PAGINATION */}
        <Pagination className="justify-content-center mt-3">
          {renderPagination()}
        </Pagination>
      </div>

      {/* DELETE REVIEW MODAL */}
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
