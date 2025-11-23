import React, { useState } from "react";
import { StarRating } from "../../utils/StarRating";
import { getImage } from "../../utils/decodeImage";
import { Form, Button } from "react-bootstrap";

const ReviewList = ({
  reviews,
  page,
  pagination,
  onPageChange,
  onReplySubmit,
  user,
}) => {
  const [replyInputs, setReplyInputs] = useState({}); // lưu reply tạm thời

  if (!reviews?.length) return <p>Chưa có đánh giá nào cho sản phẩm này.</p>;

  const handleReplyChange = (reviewId, value) => {
    setReplyInputs((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySend = (reviewId) => {
    const content = replyInputs[reviewId];
    if (!content?.trim()) return;
    onReplySubmit(reviewId, content);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <>
      {reviews.map((r) => (
        <div key={r.id} className="review-item border-bottom pb-3 mb-3">
          {/* User info */}
          <div className="d-flex align-items-center mb-2">
            {r.user?.avatar ? (
              <img
                src={getImage(r.user.avatar)}
                alt={r.user.username}
                className="rounded-circle me-2"
                width={40}
                height={40}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                style={{ width: 40, height: 40 }}
              >
                {r.user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <strong>{r.user?.username}</strong>
          </div>

          {/* Rating + comment */}
          <StarRating rating={r.rating} />
          <p className="mb-0">{r.comment}</p>
          <small className="text-muted">
            {new Date(r.createdAt).toLocaleDateString("vi-VN")}
          </small>

          {/* Replies */}
          {r.ReviewReplies?.length > 0 && (
            <div className="replies mt-2 ps-4 border-start">
              {r.ReviewReplies.map((rep) => (
                <div key={rep.id} className="reply-item mb-2">
                  <strong>
                    {rep.user?.role === "admin" ? "Admin" : rep.user?.username}:
                  </strong>{" "}
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
            <div className="user-reply mt-2 ps-4">
              <Form.Control
                type="text"
                placeholder="Trả lời..."
                value={replyInputs[r.id] || ""}
                onChange={(e) => handleReplyChange(r.id, e.target.value)}
                className="mb-1"
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
        </div>
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn btn-outline-secondary btn-sm"
        >
          Trang trước
        </button>
        <span className="text-muted">
          Trang {page}/{pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn btn-outline-primary btn-sm"
        >
          Trang sau
        </button>
      </div>
    </>
  );
};

export default React.memo(ReviewList);
