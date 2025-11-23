import React, { useState } from "react";
import { StarRating } from "../../utils/StarRating";
import { getImage } from "../../utils/decodeImage";
import { Form, Button, Modal, Card, Badge } from "react-bootstrap";

const ReviewList = ({
  reviews,
  page,
  pagination,
  onPageChange,
  onReplySubmit,
  user,
  onUpdateReview,
  onDeleteReview,
}) => {
  const [replyInputs, setReplyInputs] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState({});

  const handleReplyChange = (reviewId, value) =>
    setReplyInputs((prev) => ({ ...prev, [reviewId]: value }));

  const handleReplySend = (reviewId) => {
    const content = replyInputs[reviewId];
    if (!content?.trim()) return;
    onReplySubmit(reviewId, content);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const handleEditChange = (reviewId, value) =>
    setEditInputs((prev) => ({ ...prev, [reviewId]: value }));

  const handleEditSave = (reviewId) => {
    const content = editInputs[reviewId];
    if (!content?.trim()) return;
    onUpdateReview(reviewId, { comment: content });
    setEditInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const handleDeleteConfirm = (reviewId) => {
    onDeleteReview(reviewId);
    setShowDeleteModal((prev) => ({ ...prev, [reviewId]: false }));
  };

  if (!reviews?.length)
    return <p className="text-center text-muted">Chưa có đánh giá nào.</p>;

  return (
    <>
      {reviews.map((r) => {
        const isUserReview = user?.id === r.userId;
        return (
          <Card key={r.id} className="mb-3 shadow-sm">
            <Card.Body>
              {/* User info */}
              <div className="d-flex align-items-center mb-2">
                {r.user?.avatar ? (
                  <img
                    src={getImage(r.user.avatar)}
                    alt={r.user.username}
                    className="rounded-circle me-2"
                    width={50}
                    height={50}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                    style={{ width: 50, height: 50, fontWeight: "bold" }}
                  >
                    {r.user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <strong>{r.user?.username}</strong>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Rating + comment */}
              <StarRating rating={r.rating} />
              {editInputs[r.id] != null ? (
                <div className="d-flex gap-2 align-items-start mt-2">
                  <Form.Control
                    type="text"
                    value={editInputs[r.id]}
                    onChange={(e) => handleEditChange(r.id, e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleEditSave(r.id)}
                  >
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setEditInputs((prev) => ({ ...prev, [r.id]: "" }))
                    }
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <p className="mt-2 mb-1">{r.comment}</p>
              )}

              {/* User actions */}
              {isUserReview && editInputs[r.id] == null && (
                <div className="mt-2 d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() =>
                      setEditInputs((prev) => ({ ...prev, [r.id]: r.comment }))
                    }
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() =>
                      setShowDeleteModal((prev) => ({ ...prev, [r.id]: true }))
                    }
                  >
                    Xóa
                  </Button>
                </div>
              )}

              {/* Admin replies */}
              {r.ReviewReplies?.length > 0 && (
                <div className="replies mt-3 ps-3 border-start">
                  {r.ReviewReplies.map((rep) => (
                    <div
                      key={rep.id}
                      className="reply-item mb-2 p-2 bg-light rounded"
                    >
                      <Badge
                        bg={
                          rep.user?.role === "admin" ? "primary" : "secondary"
                        }
                        className="me-1"
                      >
                        {rep.user?.role === "admin"
                          ? "Admin"
                          : rep.user?.username}
                      </Badge>
                      {rep.comment}
                      <br />
                      <small className="text-muted">
                        {new Date(rep.createdAt).toLocaleDateString("vi-VN")}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {/* User reply input */}
              {user && (
                <div className="user-reply mt-3 d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Trả lời..."
                    value={replyInputs[r.id] || ""}
                    onChange={(e) => handleReplyChange(r.id, e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleReplySend(r.id)}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </Card.Body>

            {/* Delete modal */}
            <Modal
              show={showDeleteModal[r.id] || false}
              onHide={() =>
                setShowDeleteModal((prev) => ({ ...prev, [r.id]: false }))
              }
            >
              <Modal.Header closeButton>
                <Modal.Title>Xác nhận xóa</Modal.Title>
              </Modal.Header>
              <Modal.Body>Bạn có chắc muốn xóa đánh giá này không?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setShowDeleteModal((prev) => ({ ...prev, [r.id]: false }))
                  }
                >
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirm(r.id)}
                >
                  Xóa
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>
        );
      })}

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn btn-outline-secondary btn-sm"
        >
          &laquo; Trang trước
        </button>
        <span className="text-muted">
          Trang {page}/{pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn btn-outline-primary btn-sm"
        >
          Trang sau &raquo;
        </button>
      </div>
    </>
  );
};

export default React.memo(ReviewList);
